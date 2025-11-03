import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-10-29.clover",
  })
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user and workspace
    const supabase = createAdminClient()
    const { data: user } = await (supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUserId)
      .single() as any)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { data: workspace } = await (supabase
      .from("workspaces")
      .select("*")
      .eq("owner", user.id)
      .single() as any)

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Get billing customer
    const { data: billingCustomer } = await (supabase
      .from("billing_customers")
      .select("*")
      .eq("workspace_id", workspace.id)
      .single() as any)

    if (!billingCustomer?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: billingCustomer.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Portal session error:", error)
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    )
  }
}

