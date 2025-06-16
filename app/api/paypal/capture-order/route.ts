import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { sendPaymentSuccessEmail } from "@/lib/resend"

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY
const PAYPAL_API_URL = process.env.PAYPAL_API_URL

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json()

    const supabase = createSupabaseServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = await getPayPalAccessToken()

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const captureData = await response.json()

    if (response.ok && captureData.status === "COMPLETED") {
      const capture = captureData.purchase_units[0].payments.captures[0]
      const customId = captureData.purchase_units[0].custom_id
      const [userId, planId] = customId.split("_")

      // Get user and plan details
      const { data: user } = await supabase.from("users").select("first_name, last_name").eq("id", userId).single()

      const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).single()

      // Save transaction to database
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: userId,
        amount: Number.parseFloat(capture.amount.value),
        description: `Payment for ${plan?.name} plan`,
        status: "paid",
        stripe_charge_id: capture.id, // Using this field for PayPal ID
        created_at: new Date().toISOString(),
      })

      if (transactionError) {
        console.error("Error saving transaction:", transactionError)
      }

      // Send payment success email
      if (user && plan) {
        await sendPaymentSuccessEmail(
          session.user.email!,
          `${user.first_name} ${user.last_name}`,
          capture.id,
          Number.parseFloat(capture.amount.value),
          plan.name,
        )
      }

      return NextResponse.json({
        success: true,
        captureID: capture.id,
        status: captureData.status,
      })
    } else {
      console.error("PayPal capture failed:", captureData)
      return NextResponse.json({ error: "Payment capture failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error capturing PayPal payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
