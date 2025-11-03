"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendPill } from "./trend-pill"

export interface KPIProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: {
    direction: "up" | "down"
    value: string | number
  }
  description?: string
  icon?: React.ReactNode
}

export const KPI = React.forwardRef<HTMLDivElement, KPIProps>(
  ({ className, label, value, trend, description, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && (
            <TrendPill
              trend={trend.direction}
              value={trend.value}
              variant={trend.direction === "up" ? "success" : "danger"}
            />
          )}
        </div>
        {description && (
          <p className="text-small text-muted-foreground">{description}</p>
        )}
      </div>
    )
  }
)
KPI.displayName = "KPI"
