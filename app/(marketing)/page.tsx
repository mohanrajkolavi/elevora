"use client"

import { Button } from "@/components/ui/button"
import { MotionWrapper, StaggerItem } from "@/components/ui/motion-wrapper"
import { H1, H2, Body } from "@/components/ui/typography"
import { StatCard } from "@/components/datadisplay"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <MotionWrapper variant="fadeInUp">
          <H1 className="mb-4 bg-gradient-brand bg-clip-text text-transparent">
            Welcome to Elevora
          </H1>
          <Body className="mb-8 text-muted-foreground max-w-2xl">
            This is the marketing landing page showcasing the design system.
          </Body>
        </MotionWrapper>

        <div className="mt-12 flex gap-4 flex-wrap mb-8">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="primary">Sign In</Button>
            </SignInButton>
            <Link href="/sign-up">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
          </SignedIn>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MotionWrapper variant="stagger">
            <StaggerItem>
              <StatCard
                label="Total Users"
                value="12,345"
                trend={{ direction: "up", value: "+12%" }}
                description="Compared to last month"
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="Revenue"
                value="$45,678"
                trend={{ direction: "up", value: "+8%" }}
                description="This month"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="Conversion"
                value="3.2%"
                trend={{ direction: "down", value: "-2%" }}
                description="Last 30 days"
              />
            </StaggerItem>
          </MotionWrapper>
        </div>

        <div className="mt-12 flex gap-4 flex-wrap">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="brand">Brand Gradient</Button>
        </div>
      </div>
    </div>
  )
}