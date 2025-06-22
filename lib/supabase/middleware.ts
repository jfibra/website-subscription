import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/supabase"

export async function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Directly set the cookie on the response object that will be returned
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Directly remove the cookie on the response object that will be returned
          res.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )
  return supabase
}
