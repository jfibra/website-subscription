import { createBrowserClient as _createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Ensure this module is treated as a client-side module
// if it's not already implicitly due to '@supabase/ssr'
// 'use client'; // Uncomment if you face issues with server-only module errors

let supabaseBrowserClient: SupabaseClient | null = null

function createBrowserClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // This error should ideally be caught by build-time checks if possible,
    // but it's a good runtime safeguard.
    console.error(
      "Supabase URL or Anon Key is missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.",
    )
    throw new Error("Supabase URL or Anon Key is missing. Check environment variables.")
  }
  return _createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    try {
      supabaseBrowserClient = createBrowserClient()
    } catch (error) {
      // Log the error and potentially re-throw or handle gracefully
      // This helps in diagnosing issues if env vars are missing during client-side init
      console.error("Failed to initialize Supabase browser client:", error)
      throw error // Re-throw to make it clear initialization failed
    }
  }
  return supabaseBrowserClient
}

export const createSupabaseClient = getSupabaseBrowserClient
