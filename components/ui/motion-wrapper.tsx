"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  variant?: "fadeInUp" | "stagger"
}

export function MotionWrapper({ 
  children, 
  className,
  variant = "fadeInUp"
}: MotionWrapperProps) {
  if (variant === "stagger") {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className={cn(className)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger item component - use inside MotionWrapper with variant="stagger"
 */
export function StaggerItem({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
