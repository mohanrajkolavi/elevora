# Stripe Integration Setup Guide

## Prerequisites

1. Create a Stripe account at https://stripe.com
2. Get your API keys from Stripe Dashboard → Developers → API keys

## Environment Variables

Add these to your `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create these in Stripe Dashboard → Products)
STRIPE_PRICE_ID_SOLO_MONTHLY=price_...
STRIPE_PRICE_ID_SOLO_YEARLY=price_...
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...
STRIPE_PRICE_ID_GROWTH_MONTHLY=price_...
STRIPE_PRICE_ID_GROWTH_YEARLY=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 1: Create Products and Prices in Stripe

1. Go to Stripe Dashboard → Products
2. Create three products:
   - **Solo** ($19/month)
   - **Pro** ($49/month)
   - **Growth** ($99/month)

3. For each product, create two prices:
   - Monthly recurring price
   - Yearly recurring price (10 months = 2 months free)

4. **Important:** Add metadata to each price:
   - `plan`: `solo`, `pro`, or `growth`
   - `billing_period`: `monthly` or `yearly`

5. Copy the Price IDs and add them to `.env.local`

## Step 2: Configure Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
4. For local development, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the webhook secret it provides.

5. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

6. Copy the webhook signing secret and add to `.env.local`

## Step 3: Enable Customer Portal

1. Go to Stripe Dashboard → Settings → Billing → Customer portal
2. Configure portal settings:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Set cancellation behavior
3. Save settings

## Step 4: Test the Integration

### Test Checkout Flow:
1. Visit `/pricing`
2. Select a plan and click "Get Started"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription appears in Stripe Dashboard
6. Verify `billing_customers` table is updated

### Test Webhook:
1. Use Stripe CLI to trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   ```

### Test Customer Portal:
1. Visit `/pricing` while logged in
2. Click "Manage Billing"
3. Verify portal opens with subscription details

## Usage in Code

### Check Plan Features:

```typescript
import { checkPlanFeature } from "@/lib/billing/check-plan"

// In API route or server component
const result = await checkPlanFeature(workspaceId, "hasAnalytics")

if (!result.allowed) {
  return NextResponse.json({ error: result.reason }, { status: 403 })
}
```

### Check Usage Limits:

```typescript
import { checkUsageLimit } from "@/lib/billing/check-plan"

// Before generating content
const result = await checkUsageLimit(workspaceId, "generation")

if (!result.allowed) {
  return NextResponse.json(
    { error: `Limit reached: ${result.currentUsage}/${result.limit}` },
    { status: 403 }
  )
}
```

### Require Active Subscription:

```typescript
import { requireActiveSubscription } from "@/middleware/billing"

// In API route
const subscriptionCheck = await requireActiveSubscription(workspaceId)
if (subscriptionCheck) {
  return subscriptionCheck
}
```

## Plan Limits Reference

| Feature | Free | Solo | Pro | Growth |
|---------|------|------|-----|--------|
| Workspaces | 1 | 1 | 3 | 10 |
| Profiles | 1 | 1 | 3 | 10 |
| Generations/month | 10 | 30 | 200 | Unlimited |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| Experiments | ❌ | ❌ | ❌ | ✅ |
| Scheduling | ❌ | ❌ | ❌ | ✅ |

## Troubleshooting

### Webhook not receiving events:
- Verify webhook URL is correct
- Check webhook secret matches `.env.local`
- Ensure webhook endpoint is publicly accessible
- Use Stripe CLI for local testing

### Subscription not updating:
- Check webhook is configured correctly
- Verify event types are selected
- Check server logs for webhook errors
- Verify Stripe customer ID is stored correctly

### Customer Portal not opening:
- Ensure customer has active subscription
- Check `billing_customers` table has correct `stripe_customer_id`
- Verify Stripe portal is enabled in dashboard
