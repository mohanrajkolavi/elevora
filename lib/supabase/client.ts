"use client"

import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/lib/supabase/types"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are not set")
    // Return a mock client that won't break the app
    return createBrowserClient<Database>(
      "https://placeholder.supabase.co",
      "placeholder-key"
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
