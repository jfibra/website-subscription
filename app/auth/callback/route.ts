import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user session to determine redirect
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Get user role
        const { data: profile } = await supabase.from("users").select("roles(name)").eq("id", session.user.id).single()

        // @ts-ignore
        const userRole = profile?.roles?.name

        if (userRole === "admin") {
          return NextResponse.redirect(`${origin}/admin/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/user/dashboard`)
        }
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
