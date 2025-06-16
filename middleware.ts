import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createSupabaseMiddlewareClient(request, response)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/services",
    "/contact",
    "/pricing",
    "/terms",
    "/privacy",
    "/api/supabase-status",
    "/api/paypal/webhook",
  ]
  const authRoutes = [
    "/auth", // Add the main auth page here
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/callback",
  ]

  // Allow public routes, auth routes, and API routes needed for functionality
  if (
    publicRoutes.includes(pathname) ||
    authRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api/auth") // Supabase auth callbacks
  ) {
    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (session && authRoutes.some((route) => pathname.startsWith(route))) {
      // Get user role to determine where to redirect
      try {
        const { data: profile } = await supabase.from("users").select("roles(name)").eq("id", session.user.id).single()
        // @ts-ignore
        const userRole = profile?.roles?.name

        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        } else {
          return NextResponse.redirect(new URL("/user/dashboard", request.url))
        }
      } catch (error) {
        // If there's an error getting the role, redirect to a generic dashboard
        return NextResponse.redirect(new URL("/user/dashboard", request.url))
      }
    }
    return response
  }

  // Redirect to login if not authenticated for any other route
  if (!session) {
    const redirectUrl = new URL("/auth", request.url) // Redirect to the main auth page instead of /auth/login
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // At this point, user is authenticated.
  // Handle role-based access and redirects for /dashboard, /admin/*, /user/*

  // Fetch user's role
  let userRole: string | null = null
  try {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Middleware: Error fetching user profile:", profileError)
      // If profile fetch fails, it's safer to sign out and redirect to login
      await supabase.auth.signOut()
      const redirectUrl = new URL("/auth?error=profile_fetch_failed", request.url)
      return NextResponse.redirect(redirectUrl)
    }
    // @ts-ignore
    userRole = profile?.roles?.name
  } catch (error) {
    console.error("Middleware: Exception fetching user role:", error)
    await supabase.auth.signOut()
    const redirectUrl = new URL("/auth?error=profile_exception", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (!userRole) {
    // If role is not found, something is wrong with the user's profile setup
    console.error("Middleware: User role not found for user:", session.user.id)
    await supabase.auth.signOut()
    const redirectUrl = new URL("/auth?error=role_not_found", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard?error=unauthorized_admin_access", request.url))
  }

  // Redirect /dashboard to role-specific dashboard
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (userRole === "user") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url))
    } else {
      // Fallback if role is somehow not admin or user but session exists
      console.warn("Middleware: Unknown role for dashboard redirect:", userRole)
      return NextResponse.redirect(new URL("/auth?error=unknown_role", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /assets (publicly accessible assets)
     * - Files with extensions (e.g., .svg, .png)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
