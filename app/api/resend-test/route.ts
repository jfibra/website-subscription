import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    // Log the environment variable to help debug
    console.log("RESEND_API_KEY on server (from process.env):", process.env.RESEND_API_KEY ? "Set (masked)" : "Not set")

    // For testing purposes, hardcode a test email and name
    const testEmail = "test@example.com" // Replace with an email you can check
    const testFirstName = "TestUser"

    const { success, error } = await sendWelcomeEmail(testEmail, testFirstName)

    if (success) {
      return NextResponse.json({ message: `Test welcome email sent to ${testEmail}` })
    } else {
      // Log the specific error from sendWelcomeEmail
      console.error("sendWelcomeEmail returned an error:", error)
      return NextResponse.json({ error: error || "Failed to send test email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in /api/resend-test route handler:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
