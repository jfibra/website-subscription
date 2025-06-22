import { type NextRequest, NextResponse } from "next/server"
import { sendWebsiteRequestConfirmation } from "@/lib/resend"

export async function POST(req: NextRequest) {
  const { email, userName, websiteTitle, requestId } = await req.json()

  if (!email) {
    return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 })
  }

  const result = await sendWebsiteRequestConfirmation(
    email,
    userName ?? "User",
    websiteTitle ?? "Your Website",
    requestId,
  )

  return NextResponse.json(result)
}
