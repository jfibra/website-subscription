import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(req: Request) {
  try {
    const origin = headers().get("origin") || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Product",
              description: "This is a test payment for environment variable verification.",
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/user/test-env?status=stripe_success`,
      cancel_url: `${origin}/user/test-env?status=stripe_cancelled`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
