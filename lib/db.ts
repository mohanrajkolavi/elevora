// Re-export Supabase utilities
export { createClient } from "@/lib/supabase/client"
export { createServerClient, createServerClientWithAuth } from "@/lib/supabase/server"
export { getCurrentUser, getUserWorkspaces, hasWorkspaceAccess } from "@/lib/supabase/auth-helpers"
export type { Database } from "@/lib/supabase/types"
