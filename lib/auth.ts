import { auth, currentUser } from "@clerk/nextjs/server"

/**
 * Get the current Clerk user
 */
export async function getClerkUser() {
  return await currentUser()
}

/**
 * Get the current Clerk user ID
 */
export async function getClerkUserId() {
  const { userId } = await auth()
  return userId
}

/**
 * Sync Clerk user to Supabase users table
 * Call this after user signs up or signs in
 */
export async function syncUserToDatabase() {
  const clerkUser = await getClerkUser()
  
  if (!clerkUser) {
    return null
  }

  const { createAdminClient } = await import("@/lib/supabase/admin")
  const supabase = createAdminClient()
  
  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single()

  if (existingUser) {
    return existingUser
  }

  // Create new user
  const { data: newUser, error } = await (supabase
    .from("users")
    .insert({
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
    } as any)
    .select()
    .single() as any)

  if (error) {
    console.error("Error syncing user to database:", error)
    return null
  }

  return newUser
}
