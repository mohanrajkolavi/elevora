import { auth } from "@clerk/nextjs/server"
import { createWorkspaceClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getPlanLimits, PlanLimits } from "./plan-limits"
import { Database } from "@/lib/supabase/types"

type BillingPlan = Database["public"]["Tables"]["billing_customers"]["Row"]["plan"]

interface PlanCheckResult {
  allowed: boolean
  plan: BillingPlan
  limits: PlanLimits
  reason?: string
}

/**
 * Check if a user's workspace has access to a specific feature
 */
export async function checkPlanFeature(
  workspaceId: string,
  feature: keyof PlanLimits
): Promise<PlanCheckResult> {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    return {
      allowed: false,
      plan: "free",
      limits: getPlanLimits("free"),
      reason: "User not authenticated",
    }
  }

  try {
    const supabase = createAdminClient()
    
    // Get billing customer for workspace
    const { data: billingCustomer } = await (supabase
      .from("billing_customers")
      .select("plan, status")
      .eq("workspace_id", workspaceId)
      .single() as any)

    const plan = billingCustomer?.plan || "free"
    const status = billingCustomer?.status || "inactive"

    // Check if subscription is active
    if (status !== "active" && status !== "trialing") {
      return {
        allowed: false,
        plan,
        limits: getPlanLimits(plan),
        reason: "Subscription is not active",
      }
    }

    const limits = getPlanLimits(plan)
    const featureValue = limits[feature]

    // For boolean features
    if (typeof featureValue === "boolean") {
      return {
        allowed: featureValue,
        plan,
        limits,
        reason: featureValue ? undefined : `Feature not available on ${plan} plan`,
      }
    }

    // For numeric/null features (unlimited if null)
    return {
      allowed: featureValue === null || featureValue > 0,
      plan,
      limits,
      reason: featureValue === null || featureValue > 0 
        ? undefined 
        : `Limit reached for ${plan} plan`,
    }
  } catch (error) {
    console.error("Error checking plan feature:", error)
    return {
      allowed: false,
      plan: "free",
      limits: getPlanLimits("free"),
      reason: "Error checking plan",
    }
  }
}

/**
 * Check if user can perform an action based on current usage
 */
export async function checkUsageLimit(
  workspaceId: string,
  action: "generation" | "profile" | "workspace"
): Promise<PlanCheckResult & { currentUsage: number; limit: number | null }> {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    return {
      allowed: false,
      plan: "free",
      limits: getPlanLimits("free"),
      reason: "User not authenticated",
      currentUsage: 0,
      limit: 0,
    }
  }

  try {
    const supabase = createAdminClient()
    
    // Get billing customer
    const { data: billingCustomer } = await (supabase
      .from("billing_customers")
      .select("plan, status")
      .eq("workspace_id", workspaceId)
      .single() as any)

    const plan = billingCustomer?.plan || "free"
    const limits = getPlanLimits(plan)

    let currentUsage = 0
    let limit: number | null = null

    if (action === "generation") {
      limit = limits.generationsPerMonth
      // Count generations this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await (supabase
        .from("generated_posts")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId)
        .gte("created_at", startOfMonth.toISOString()) as any)

      currentUsage = count || 0
    } else if (action === "profile") {
      limit = limits.profiles
      const { count } = await (supabase
        .from("voice_profiles")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId) as any)

      currentUsage = count || 0
    } else if (action === "workspace") {
      limit = limits.workspaces
      // For workspace check, we need the user ID, not workspace ID
      const { data: user } = await (supabase
        .from("users")
        .select("id")
        .eq("id", workspaceId)
        .single() as any)
      
      if (user) {
        const { count } = await (supabase
          .from("workspaces")
          .select("*", { count: "exact", head: true })
          .eq("owner", user.id) as any)
        
        currentUsage = count || 0
      }
    }

    const allowed = limit === null || currentUsage < limit

    return {
      allowed,
      plan,
      limits,
      reason: allowed ? undefined : `${action} limit reached (${currentUsage}/${limit})`,
      currentUsage,
      limit,
    }
  } catch (error) {
    console.error("Error checking usage limit:", error)
    return {
      allowed: false,
      plan: "free",
      limits: getPlanLimits("free"),
      reason: "Error checking usage",
      currentUsage: 0,
      limit: 0,
    }
  }
}

