import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = await createSupabaseMiddlewareClient(req, res)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // If user is not logged in and trying to access protected routes
  if (
    !session &&
    (pathname.startsWith("/admin") || pathname.startsWith("/user") || pathname.startsWith("/dashboard"))
  ) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/auth/login"
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in
  if (session) {
    // Prevent logged-in users from accessing auth pages like login/register
    if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url)) // Redirect to a generic dashboard first
    }

    // Fetch user's role from your public.users table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", session.user.id)
      .single()

    if (profileError || !profile) {
      // Handle error, maybe redirect to an error page or logout
      console.error("Middleware: Error fetching user profile:", profileError)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/auth/login" // Force login again if profile is missing
      await supabase.auth.signOut() // Clear potentially problematic session
      return NextResponse.redirect(redirectUrl)
    }

    // @ts-ignore
    const userRole = profile.roles.name

    // Role-based access control
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/user/dashboard?error=unauthorized", req.url)) // Or a generic unauthorized page
    }
    if (pathname.startsWith("/user") && userRole !== "user") {
      // Admins might be allowed to see user dashboard, or redirect them to admin dashboard
      if (userRole === "admin") {
        // return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        // For now, let admin access user dashboard if they navigate there directly.
        // Or, be strict:
        // return NextResponse.redirect(new URL("/admin/dashboard?error=unauthorized_user_page", req.url))
      } else {
        return NextResponse.redirect(new URL("/auth/login?error=unauthorized", req.url))
      }
    }

    // Redirect /dashboard to role-specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      } else if (userRole === "user") {
        return NextResponse.redirect(new URL("/user/dashboard", req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (public homepage, if you want it unprotected)
     * - /api/auth (Supabase auth callbacks)
     * - /auth/reset-password (allow access for password reset flow) - careful with this, ensure token validation on page
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth/reset-password|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Add public pages that should not be matched by middleware here if needed
    // e.g. if '/' is public: "/((?!_next/static|_next/image|favicon.ico|api/auth|/$).*)",
  ],
}
