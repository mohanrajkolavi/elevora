"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TrendPillProps extends React.HTMLAttributes<HTMLDivElement> {
  trend: "up" | "down"
  value: string | number
  variant?: "default" | "success" | "danger"
}

export const TrendPill = React.forwardRef<HTMLDivElement, TrendPillProps>(
  ({ className, trend, value, variant = "default", ...props }, ref) => {
    const isUp = trend === "up"
    const Icon = isUp ? TrendingUp : TrendingDown
    
    const variantStyles = {
      default: isUp 
        ? "bg-success/10 text-success border-success/20" 
        : "bg-danger/10 text-danger border-danger/20",
      success: "bg-success/10 text-success border-success/20",
      danger: "bg-danger/10 text-danger border-danger/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <Icon className="h-3 w-3" />
        <span>{value}</span>
      </div>
    )
  }
)
TrendPill.displayName = "TrendPill"
