import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    // For testing purposes, hardcode a test email and name
    const testEmail = "test@example.com" // Replace with an email you can check
    const testFirstName = "TestUser"

    const { success, error } = await sendWelcomeEmail(testEmail, testFirstName)

    if (success) {
      return NextResponse.json({ message: `Test welcome email sent to ${testEmail}` })
    } else {
      return NextResponse.json({ error: error || "Failed to send test email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
