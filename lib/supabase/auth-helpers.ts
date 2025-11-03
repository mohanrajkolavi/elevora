import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "./server"

/**
 * Helper function to get the current user's database record
 * based on their Clerk authentication
 */
export async function getCurrentUser() {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    return null
  }

  const supabase = createServerClient()
  
  const { data: user, error } = await (supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUserId)
    .single() as any)

  if (error || !user) {
    return null
  }

  return user as { id: string; clerk_id: string; email: string; created_at: string }
}

/**
 * Helper function to get all workspaces for the current user
 */
export async function getUserWorkspaces() {
  const user = await getCurrentUser()
  
  if (!user || !user.id) {
    return []
  }

  const userId = user.id
  const supabase = createServerClient()
  
  // Get workspaces where user is owner or member
  const { data: workspaces, error } = await (supabase
    .from("workspaces")
    .select(`
      *,
      workspace_members!inner(user_id, role)
    `)
    .or(`owner.eq.${userId},workspace_members.user_id.eq.${userId}`) as any)

  if (error) {
    console.error("Error fetching workspaces:", error)
    return []
  }

  return workspaces || []
}

/**
 * Helper function to check if user has access to a workspace
 */
export async function hasWorkspaceAccess(workspaceId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  const supabase = createServerClient()
  
  // Check if user is owner
  const { data: workspace } = await (supabase
    .from("workspaces")
    .select("owner")
    .eq("id", workspaceId)
    .eq("owner", user.id)
    .single() as any)

  if (workspace) {
    return true
  }

  // Check if user is a member
  const { data: membership } = await (supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single() as any)

  return !!membership
}
