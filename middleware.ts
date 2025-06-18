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
    "/auth",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/callback",
  ]

  // Allow public routes, auth routes, and API routes
  if (
    publicRoutes.includes(pathname) ||
    authRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    // If user is logged in and tries to access auth pages, redirect to appropriate dashboard
    if (session && authRoutes.some((route) => pathname.startsWith(route)) && pathname !== "/auth/callback") {
      try {
        const { data: profile } = await supabase.from("users").select("roles(name)").eq("id", session.user.id).single()
        // @ts-ignore
        const userRole = profile?.roles?.name

        console.log("Middleware - Redirecting logged in user, role:", userRole) // Debug log

        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url))
        } else {
          return NextResponse.redirect(new URL("/user/dashboard", request.url))
        }
      } catch (error) {
        console.error("Middleware role fetch error:", error)
        return NextResponse.redirect(new URL("/user/dashboard", request.url))
      }
    }
    return response
  }

  // Redirect to login if not authenticated
  if (!session) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Fetch user's role for authenticated users
  let userRole: string | null = null
  try {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Middleware: Error fetching user profile:", profileError)
      await supabase.auth.signOut()
      const redirectUrl = new URL("/auth/login?error=profile_fetch_failed", request.url)
      return NextResponse.redirect(redirectUrl)
    }
    // @ts-ignore
    userRole = profile?.roles?.name
    console.log("Middleware - User role:", userRole, "Path:", pathname) // Debug log
  } catch (error) {
    console.error("Middleware: Exception fetching user role:", error)
    await supabase.auth.signOut()
    const redirectUrl = new URL("/auth/login?error=profile_exception", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (!userRole) {
    console.error("Middleware: User role not found for user:", session.user.id)
    await supabase.auth.signOut()
    const redirectUrl = new URL("/auth/login?error=role_not_found", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    console.log("Middleware - Blocking non-admin access to admin area")
    return NextResponse.redirect(new URL("/user/dashboard?error=unauthorized_admin_access", request.url))
  }

  // Redirect /dashboard to role-specific dashboard
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else if (userRole === "user") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
