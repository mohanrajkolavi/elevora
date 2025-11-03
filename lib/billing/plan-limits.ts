import { Database } from "@/lib/supabase/types"

type BillingPlan = Database["public"]["Tables"]["billing_customers"]["Row"]["plan"]

export interface PlanLimits {
  workspaces: number
  profiles: number
  generationsPerMonth: number | null // null = unlimited
  hasAnalytics: boolean
  hasExperiments: boolean
  hasScheduling: boolean
}

export const PLAN_LIMITS: Record<BillingPlan, PlanLimits> = {
  free: {
    workspaces: 1,
    profiles: 1,
    generationsPerMonth: 10,
    hasAnalytics: false,
    hasExperiments: false,
    hasScheduling: false,
  },
  solo: {
    workspaces: 1,
    profiles: 1,
    generationsPerMonth: 30,
    hasAnalytics: false,
    hasExperiments: false,
    hasScheduling: false,
  },
  pro: {
    workspaces: 3,
    profiles: 3,
    generationsPerMonth: 200,
    hasAnalytics: true,
    hasExperiments: false,
    hasScheduling: false,
  },
  growth: {
    workspaces: 10,
    profiles: 10,
    generationsPerMonth: null, // unlimited
    hasAnalytics: true,
    hasExperiments: true,
    hasScheduling: true,
  },
}

export function getPlanLimits(plan: BillingPlan): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free
}

export function checkPlanFeature(
  plan: BillingPlan,
  feature: keyof PlanLimits
): boolean {
  const limits = getPlanLimits(plan)
  return limits[feature] === true || limits[feature] === null
}

