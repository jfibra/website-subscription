import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY
const PAYPAL_API_URL = process.env.PAYPAL_API_URL

// PayPal webhook signature verification
async function verifyPayPalWebhook(headers: Headers, body: string, webhookId: string): Promise<boolean> {
  try {
    const authAlgo = headers.get("paypal-auth-algo")
    const transmissionId = headers.get("paypal-transmission-id")
    const certUrl = headers.get("paypal-cert-url")
    const transmissionSig = headers.get("paypal-transmission-sig")
    const transmissionTime = headers.get("paypal-transmission-time")

    if (!authAlgo || !transmissionId || !certUrl || !transmissionSig || !transmissionTime) {
      console.error("Missing PayPal webhook headers")
      return false
    }

    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString("base64")
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Verify webhook signature
    const verificationData = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }

    const verifyResponse = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(verificationData),
    })

    const verifyResult = await verifyResponse.json()
    return verifyResult.verification_status === "SUCCESS"
  } catch (error) {
    console.error("Error verifying PayPal webhook:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = request.headers

    // Parse the webhook payload
    let webhookEvent
    try {
      webhookEvent = JSON.parse(body)
    } catch (error) {
      console.error("Invalid JSON payload")
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    // Log the webhook event
    console.log("PayPal Webhook Event:", {
      event_type: webhookEvent.event_type,
      resource_type: webhookEvent.resource_type,
      summary: webhookEvent.summary,
    })

    const supabase = createSupabaseServerClient()

    // Optional: Store webhook event in database
    const { error: webhookLogError } = await supabase
      .from("paypal_webhooks")
      .insert({
        event_type: webhookEvent.event_type,
        resource_type: webhookEvent.resource_type,
        resource_id: webhookEvent.resource?.id,
        payload: webhookEvent,
        created_at: new Date().toISOString(),
      })
      .select()

    if (webhookLogError) {
      console.error("Error logging webhook:", webhookLogError)
    }

    // Handle different event types
    switch (webhookEvent.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCaptureCompleted(webhookEvent, supabase)
        break

      case "CHECKOUT.ORDER.APPROVED":
        await handleCheckoutOrderApproved(webhookEvent, supabase)
        break

      case "BILLING.SUBSCRIPTION.CREATED":
        await handleSubscriptionCreated(webhookEvent, supabase)
        break

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleSubscriptionCancelled(webhookEvent, supabase)
        break

      default:
        console.log(`Unhandled webhook event type: ${webhookEvent.event_type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentCaptureCompleted(webhookEvent: any, supabase: any) {
  try {
    const capture = webhookEvent.resource
    const customId = capture.custom_id

    if (customId) {
      const [userId, planId] = customId.split("_")

      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: "paid",
          receipt_url: capture.links?.find((link: any) => link.rel === "self")?.href,
        })
        .eq("stripe_charge_id", capture.id) // Using this field for PayPal ID

      if (updateError) {
        console.error("Error updating transaction:", updateError)
      }

      // Update user subscription status or create website entry
      const { error: websiteError } = await supabase
        .from("websites")
        .update({ status: "active" })
        .eq("user_id", userId)
        .eq("plan_id", planId)

      if (websiteError) {
        console.error("Error updating website status:", websiteError)
      }

      console.log(`Payment completed for user ${userId}, plan ${planId}`)
    }
  } catch (error) {
    console.error("Error handling payment capture completed:", error)
  }
}

async function handleCheckoutOrderApproved(webhookEvent: any, supabase: any) {
  try {
    const order = webhookEvent.resource
    console.log(`Order approved: ${order.id}`)

    // You can add logic here to handle order approval
    // This typically happens before payment capture
  } catch (error) {
    console.error("Error handling checkout order approved:", error)
  }
}

async function handleSubscriptionCreated(webhookEvent: any, supabase: any) {
  try {
    const subscription = webhookEvent.resource
    console.log(`Subscription created: ${subscription.id}`)

    // Handle subscription creation logic
    // Update user subscription status, etc.
  } catch (error) {
    console.error("Error handling subscription created:", error)
  }
}

async function handleSubscriptionCancelled(webhookEvent: any, supabase: any) {
  try {
    const subscription = webhookEvent.resource
    console.log(`Subscription cancelled: ${subscription.id}`)

    // Handle subscription cancellation logic
    // Update user subscription status, pause websites, etc.
  } catch (error) {
    console.error("Error handling subscription cancelled:", error)
  }
}
