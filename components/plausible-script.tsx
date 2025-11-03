"use client"

import { useEffect } from "react"
import { usePlausible } from "plausible-tracker"

export function PlausibleProvider({ children }: { children: React.ReactNode }) {
  const { plausible } = usePlausible()

  useEffect(() => {
    // Initialize Plausible
    if (typeof window !== "undefined") {
      // Plausible script is loaded via script tag in layout
      console.log("Plausible tracker initialized")
    }
  }, [])

  return <>{children}</>
}

// Helper function to track events
export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    ;(window as any).plausible(eventName, { props })
    console.log(`[Analytics] Tracked: ${eventName}`, props || {})
  } else {
    // Fallback for local development
    console.log(`[Analytics] Tracked (dev): ${eventName}`, props || {})
  }
}

