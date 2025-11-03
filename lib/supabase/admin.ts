/**
 * Admin/Service Role Client
 * Use this only in server-side code for operations that need to bypass RLS
 * Always validate user permissions in application code before using this
 */

import { createClient } from "@supabase/supabase-js"
import { Database } from "./types"

/**
 * Create a Supabase admin client with service role key
 * This bypasses RLS - use with caution and always validate permissions first
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
