import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

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
    const { planId, amount, currency = "USD" } = await request.json()

    const supabase = createSupabaseServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get plan details
    const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).single()

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    const accessToken = await getPayPalAccessToken()

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `${plan.name} - ${process.env.NEXT_PUBLIC_APP_NAME}`,
          custom_id: `${session.user.id}_${planId}`,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard?payment=cancelled`,
      },
    }

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (response.ok) {
      return NextResponse.json({ orderID: order.id })
    } else {
      console.error("PayPal order creation failed:", order)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
