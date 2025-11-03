import { NextResponse } from "next/server"
import { checkPlanFeature, checkUsageLimit } from "@/lib/billing/check-plan"
import { auth } from "@clerk/nextjs/server"

/**
 * Middleware to check if a workspace has access to a feature
 * Usage: const result = await checkFeatureAccess(workspaceId, "hasAnalytics")
 */
export async function checkFeatureAccess(
  workspaceId: string,
  feature: "hasAnalytics" | "hasExperiments" | "hasScheduling"
) {
  const result = await checkPlanFeature(workspaceId, feature)
  
  if (!result.allowed) {
    return NextResponse.json(
      { 
        error: result.reason || "Feature not available on your plan",
        requiredPlan: feature === "hasAnalytics" ? "pro" : "growth"
      },
      { status: 403 }
    )
  }

  return null // Allow request to continue
}

/**
 * Middleware to check usage limits before an action
 * Usage: const result = await checkActionLimit(workspaceId, "generation")
 */
export async function checkActionLimit(
  workspaceId: string,
  action: "generation" | "profile" | "workspace"
) {
  const result = await checkUsageLimit(workspaceId, action)
  
  if (!result.allowed) {
    return NextResponse.json(
      { 
        error: result.reason || "Usage limit reached",
        currentUsage: result.currentUsage,
        limit: result.limit,
      },
      { status: 403 }
    )
  }

  return null // Allow request to continue
}

/**
 * Helper to ensure user has workspace access and active subscription
 */
export async function requireActiveSubscription(workspaceId: string) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { createWorkspaceClient } = await import("@/lib/supabase/server")
    const { createAdminClient } = await import("@/lib/supabase/admin")
    
    await createWorkspaceClient(userId, workspaceId)
    
    const supabase = createAdminClient()
    const { data: billingCustomer } = await (supabase
      .from("billing_customers")
      .select("plan, status")
      .eq("workspace_id", workspaceId)
      .single() as any)

    const status = billingCustomer?.status || "inactive"

    if (status !== "active" && status !== "trialing") {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      )
    }

    return null
  } catch (error) {
    console.error("Error checking subscription:", error)
    return NextResponse.json(
      { error: "Error checking subscription status" },
      { status: 500 }
    )
  }
}

