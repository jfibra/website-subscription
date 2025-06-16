import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Explicitly check for environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase Environment Variables Missing:", {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "Present" : "Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "Present" : "Missing",
      })
      return NextResponse.json(
        {
          status: "error",
          message: "Supabase environment variables are not configured.",
          details: "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
          code: "ENV_VAR_MISSING",
        },
        { status: 500 },
      )
    }

    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Supabase getSession failed:", error) // Log the full error object
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to retrieve Supabase session.",
          details: error.message,
          code: error.code || "SUPABASE_GET_SESSION_ERROR",
        },
        { status: 500 },
      )
    }

    if (data?.session) {
      return NextResponse.json(
        {
          status: "success",
          message: "Successfully connected to Supabase and retrieved an active session.",
          user_id: data.session.user.id,
          user_email: data.session.user.email,
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          status: "success",
          message: "Successfully connected to Supabase, but no active session found (user not logged in).",
        },
        { status: 200 },
      )
    }
  } catch (e: any) {
    console.error("Supabase connection check caught an unhandled exception:", e) // Log the full exception object
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred during Supabase connection check.",
        details: e.message || "No specific error message provided.",
        stack: e.stack || "No stack trace available.",
        code: "UNHANDLED_EXCEPTION",
      },
      { status: 500 },
    )
  }
}
