import { createServerClient as createSSRServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/lib/supabase/types"
import { createAdminClient } from "./admin"

/**
 * Create a server-side Supabase client
 * Uses the anon key - will be restricted by RLS
 */
export function createServerClient() {
  const cookieStore = cookies()
  
  return createSSRServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Create a server-side client with authenticated user context
 * Returns the user from database and a client that can be used with permission checks
 */
export async function createServerClientWithAuth(clerkUserId: string) {
  const supabase = createAdminClient()
  
  // Get the user from our users table using admin client
  const { data: user, error } = await (supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUserId)
    .single() as any)

  if (error || !user) {
    throw new Error("User not found in database")
  }

  const typedUser = user as { id: string; clerk_id: string; email: string; created_at: string }

  return { supabase, user: typedUser }
}

/**
 * Create a server-side client with workspace access validation
 */
export async function createWorkspaceClient(clerkUserId: string, workspaceId: string) {
  const { supabase: adminClient, user } = await createServerClientWithAuth(clerkUserId)
  
  // Validate workspace access
  const { data: workspace } = await (adminClient
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single() as any)

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  const typedWorkspace = workspace as { id: string; owner: string; name: string; created_at: string }

  // Check if user is owner
  if (typedWorkspace.owner === user.id) {
    return { supabase: adminClient, user, workspace: typedWorkspace, role: "owner" as const }
  }

  // Check if user is a member
  const { data: membership } = await (adminClient
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single() as any)

  if (!membership) {
    throw new Error("Access denied: User is not a member of this workspace")
  }

  const typedMembership = membership as { role: "owner" | "admin" | "member" }

  return { 
    supabase: adminClient, 
    user, 
    workspace: typedWorkspace, 
    role: typedMembership.role 
  }
}
