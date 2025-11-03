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

    const { plan, billingPeriod } = await req.json()

    if (!plan || !billingPeriod) {
      return NextResponse.json(
        { error: "Plan and billing period are required" },
        { status: 400 }
      )
    }

    // Get user from database
    const supabase = createAdminClient()
    const { data: user } = await (supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUserId)
      .single() as any)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get or create workspace for user (assuming single workspace for now)
    const { data: workspace } = await (supabase
      .from("workspaces")
      .select("*")
      .eq("owner", user.id)
      .single() as any)

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Check if customer exists
    let { data: billingCustomer } = await (supabase
      .from("billing_customers")
      .select("*")
      .eq("workspace_id", workspace.id)
      .single() as any)

    let stripeCustomerId: string

    if (billingCustomer?.stripe_customer_id) {
      stripeCustomerId = billingCustomer.stripe_customer_id
    } else {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          clerk_user_id: clerkUserId,
          user_id: user.id,
          workspace_id: workspace.id,
        },
      })

      stripeCustomerId = customer.id

      // Save to database
      await (supabase
        .from("billing_customers")
        .insert({
          workspace_id: workspace.id,
          stripe_customer_id: customer.id,
          plan: plan,
          status: "pending",
        } as any))
    }

    // Create Checkout Session
    const priceIdEnvKey = `STRIPE_PRICE_ID_${plan.toUpperCase()}_${billingPeriod.toUpperCase()}`
    const priceId = process.env[priceIdEnvKey]

    if (!priceId) {
      console.error(`Missing environment variable: ${priceIdEnvKey}`)
      return NextResponse.json(
        { error: `Price ID not configured for ${plan} ${billingPeriod}. Please set ${priceIdEnvKey} in .env.local` },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
      metadata: {
        workspace_id: workspace.id,
        user_id: user.id,
        clerk_user_id: clerkUserId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

