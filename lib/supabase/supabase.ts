/**
 * Aggregates Supabase helpers so that other modules can do:
 *   import { getSupabaseBrowserClient, getSupabaseServerClient } from "@/lib/supabase/supabase"
 *
 * No new logic is added here – we just re-export the existing helpers.
 */

export { getSupabaseBrowserClient } from "./client"
export { createSupabaseServerClient as getSupabaseServerClient } from "./server"
