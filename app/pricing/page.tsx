"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Rocket, Building2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

type BillingPeriod = "monthly" | "yearly"

const plans = {
  solo: {
    name: "Solo",
    icon: Zap,
    monthlyPrice: 19,
    yearlyPrice: 190, // $19 * 10 months (2 free)
    description: "Perfect for individuals getting started",
    features: [
      "1 workspace",
      "1 voice profile",
      "30 generations/month",
      "Basic support",
    ],
  },
  pro: {
    name: "Pro",
    icon: Rocket,
    monthlyPrice: 49,
    yearlyPrice: 490, // $49 * 10 months
    description: "For growing creators and small teams",
    features: [
      "3 workspaces",
      "3 voice profiles",
      "200 generations/month",
      "Analytics dashboard",
      "Priority support",
    ],
  },
  growth: {
    name: "Growth",
    icon: Building2,
    monthlyPrice: 99,
    yearlyPrice: 990, // $99 * 10 months
    description: "For agencies and scaling businesses",
    features: [
      "10 workspaces",
      "10 voice profiles",
      "Unlimited generations",
      "Advanced analytics",
      "A/B testing experiments",
      "Unlimited scheduling",
      "Dedicated support",
    ],
  },
} as const

export default function PricingPage() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: keyof typeof plans) => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/pricing")
      return
    }

    setLoading(plan)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          billingPeriod,
        }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout. Please try again.")
      setLoading(null)
    }
  }

  const handleManageBilling = async () => {
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    setLoading("manage")
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No portal URL returned")
      }
    } catch (error) {
      console.error("Portal error:", error)
      alert("Failed to open billing portal. Please try again.")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Start free, upgrade when you&apos;re ready
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-2xl mb-8">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">
                2 months free
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {Object.entries(plans).map(([planKey, plan]) => {
            const Icon = plan.icon
            const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
            const priceDisplay = billingPeriod === "yearly" 
              ? `$${price}/year` 
              : `$${price}/month`

            return (
              <Card
                key={planKey}
                className={`relative ${planKey === "pro" ? "border-primary scale-105" : ""}`}
              >
                {planKey === "pro" && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{priceDisplay}</span>
                    {billingPeriod === "yearly" && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (save ${plan.monthlyPrice * 2}/year)
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={planKey === "pro" ? "default" : "outline"}
                    onClick={() => handleCheckout(planKey as keyof typeof plans)}
                    disabled={loading !== null}
                  >
                    {loading === planKey ? "Loading..." : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Manage Billing */}
        {isSignedIn && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleManageBilling}
              disabled={loading === "manage"}
            >
              {loading === "manage" ? "Loading..." : "Manage Billing"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

