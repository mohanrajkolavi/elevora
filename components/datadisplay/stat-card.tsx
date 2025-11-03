"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPI, KPIProps } from "./kpi"
import { fadeInUp } from "@/lib/motion"

export interface StatCardProps
  extends Omit<KPIProps, "className">,
    React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, animate = true, label, value, trend, description, icon, ...props },
    ref
  ) => {
    const content = (
      <Card
        ref={ref}
        className={cn("focus-ring", className)}
        {...props}
      >
        <CardHeader>
          <CardTitle className="sr-only">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <KPI
            label={label}
            value={value}
            trend={trend}
            description={description}
            icon={icon}
          />
        </CardContent>
      </Card>
    )

    if (animate) {
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {content}
        </motion.div>
      )
    }

    return content
  }
)
StatCard.displayName = "StatCard"
