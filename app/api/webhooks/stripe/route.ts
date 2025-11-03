import { NextResponse } from "next/server"
import { headers } from "next/headers"
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

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set")
  }
  return secret
}

// Helper to update billing customer (bypasses type checking)
async function updateBillingCustomer(
  supabase: any,
  workspaceId: string,
  data: any
) {
  const query = supabase.from("billing_customers") as any
  return await query.update(data).eq("workspace_id", workspaceId)
}

async function updateBillingCustomerByStripeId(
  supabase: any,
  customerId: string,
  data: any
) {
  const query = supabase.from("billing_customers") as any
  return await query.update(data).eq("stripe_customer_id", customerId)
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const webhookSecret = getWebhookSecret()
    
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

    const supabase = createAdminClient()

    try {
      switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const workspaceId = session.metadata?.workspace_id

        if (!workspaceId) {
          console.error("No workspace_id in session metadata")
          break
        }

        // Get subscription details
        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const plan = (subscription.items.data[0]?.price.metadata?.plan as string) || "free"

        // Update or create billing customer record
        const subscriptionData = subscription as any
        const currentPeriodEnd = subscriptionData.current_period_end
          ? new Date(subscriptionData.current_period_end * 1000).toISOString()
          : null

        const { error } = await (supabase
          .from("billing_customers")
          .upsert({
            workspace_id: workspaceId,
            stripe_customer_id: session.customer as string,
            plan: plan as any,
            status: subscription.status,
            current_period_end: currentPeriodEnd,
          } as any))

        if (error) {
          console.error("Error updating billing_customers:", error)
        }

        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find workspace by customer ID
        const { data: billingCustomer } = await (supabase
          .from("billing_customers")
          .select("workspace_id")
          .eq("stripe_customer_id", customerId)
          .single() as any)

        if (!billingCustomer) {
          console.error("Billing customer not found for customer:", customerId)
          break
        }

        if (event.type === "customer.subscription.deleted") {
          // Downgrade to free plan
          await updateBillingCustomer(supabase, billingCustomer.workspace_id, {
            plan: "free",
            status: "canceled",
            current_period_end: null,
          })
        } else {
          // Update subscription
          const plan = (subscription.items.data[0]?.price.metadata?.plan as string) || "free"
          const subscriptionData = subscription as any
          const currentPeriodEnd = subscriptionData.current_period_end
            ? new Date(subscriptionData.current_period_end * 1000).toISOString()
            : null

          await updateBillingCustomer(supabase, billingCustomer.workspace_id, {
            plan: plan as any,
            status: subscription.status,
            current_period_end: currentPeriodEnd,
          })
        }

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const invoiceData = invoice as any

        // Update current_period_end
        if (invoiceData.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoiceData.subscription as string
          )

          const subscriptionData = subscription as any
          const currentPeriodEnd = subscriptionData.current_period_end
            ? new Date(subscriptionData.current_period_end * 1000).toISOString()
            : null

          await updateBillingCustomerByStripeId(supabase, customerId, {
            status: subscription.status,
            current_period_end: currentPeriodEnd,
          })
        }

        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Update status to past_due
        await updateBillingCustomerByStripeId(supabase, customerId, {
          status: "past_due",
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error("Webhook handler error:", error)
      return NextResponse.json(
        { error: "Webhook handler failed" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Stripe initialization error:", error)
    return NextResponse.json(
      { error: error.message || "Stripe configuration error" },
      { status: 500 }
    )
  }
}

