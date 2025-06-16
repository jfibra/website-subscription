import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/supabase"

export async function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          // NextResponse.next() is used to actually set the cookie
          // This is a bit of a workaround for middleware
          const response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
          return response
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          const response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
          return response
        },
      },
    },
  )
}
