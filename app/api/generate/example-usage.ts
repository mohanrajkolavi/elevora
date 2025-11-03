/**
 * Example API route showing how to check plan limits before generating content
 * This would be in: app/api/generate/route.ts
 */

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { checkUsageLimit, checkPlanFeature } from "@/lib/billing/check-plan"
import { createWorkspaceClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId, content } = await req.json()

    // 1. Verify workspace access
    const { workspace } = await createWorkspaceClient(clerkUserId, workspaceId)

    // 2. Check generation limit
    const limitCheck = await checkUsageLimit(workspaceId, "generation")
    
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.reason,
          currentUsage: limitCheck.currentUsage,
          limit: limitCheck.limit,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // 3. Check specific feature access (if needed)
    const analyticsCheck = await checkPlanFeature(workspaceId, "hasAnalytics")
    
    // 4. Generate content (your logic here)
    // ...

    return NextResponse.json({
      success: true,
      remaining: limitCheck.limit ? limitCheck.limit - (limitCheck.currentUsage + 1) : null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

