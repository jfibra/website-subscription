import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createSupabaseMiddlewareClient(request, response) // Corrected function call
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
    // If user is logged in and tries to access login/register, redirect to dashboard
    if (session && (pathname === "/auth/login" || pathname === "/auth/register")) {
      // We need to determine where to redirect, this might require a quick role check or a generic dashboard
      // For now, let's redirect to a generic /dashboard which will then be handled by role-based redirect
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return response
  }

  // Redirect to login if not authenticated for any other route
  if (!session) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirectedFrom", pathname) // Use a different param name to avoid conflict
    return NextResponse.redirect(redirectUrl)
  }

  // At this point, user is authenticated.
  // Handle role-based access and redirects for /dashboard, /admin/*, /user/*

  // Fetch user's role
  // Note: This part was simplified in the last update, let's ensure it's robust.
  // The previous version had a more detailed role fetching logic.
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
      const redirectUrl = new URL("/auth/login?error=profile_fetch_failed", request.url)
      return NextResponse.redirect(redirectUrl)
    }
    // @ts-ignore
    userRole = profile?.roles?.name
  } catch (error) {
    console.error("Middleware: Exception fetching user role:", error)
    await supabase.auth.signOut()
    const redirectUrl = new URL("/auth/login?error=profile_exception", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (!userRole) {
    // If role is not found, something is wrong with the user's profile setup
    console.error("Middleware: User role not found for user:", session.user.id)
    await supabase.auth.signOut()
    const redirectUrl = new URL("/auth/login?error=role_not_found", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard?error=unauthorized_admin_access", request.url))
  }

  // User routes are generally accessible by 'user' role. Admins might also access them.
  // If a route is strictly for 'user' and not 'admin', add specific checks.
  // For now, /user/* is accessible if the role is 'user' or 'admin' (as admin is a superset).
  // If an admin tries to access a /user/* page, they are allowed.
  // If a non-admin, non-user role somehow exists and tries to access /user/*, they should be blocked.
  // However, our current roles are 'admin' and 'user'.

  // Redirect /dashboard to role-specific dashboard
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (userRole === "user") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url))
    } else {
      // Fallback if role is somehow not admin or user but session exists
      console.warn("Middleware: Unknown role for dashboard redirect:", userRole)
      return NextResponse.redirect(new URL("/auth/login?error=unknown_role", request.url))
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
     * - Specific API routes that should be public (e.g., webhooks, status checks if unauthenticated)
     * - Files with extensions (e.g., .svg, .png)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Ensure /api/supabase-status and /api/paypal/webhook are excluded if they need to be public
    // The current matcher logic should allow them if they are in publicRoutes array and handled before session check.
    // However, the matcher itself can be made more specific.
    // For now, the logic inside the middleware handles public API routes.
  ],
}
