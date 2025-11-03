"use client"

import { Variants } from "framer-motion"

/**
 * Check if user prefers reduced motion
 * This is handled by CSS @media (prefers-reduced-motion: reduce)
 * but we also provide minimal animations as fallback
 */
const getReducedMotionDuration = (duration: number) => {
  if (typeof window === "undefined") return duration
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return prefersReduced ? 0.01 : duration
}

/**
 * Fade in up animation - respects prefers-reduced-motion
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getReducedMotionDuration(0.5),
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

/**
 * Stagger children animation - respects prefers-reduced-motion
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: getReducedMotionDuration(0.1),
      delayChildren: getReducedMotionDuration(0.1),
    },
  },
}

/**
 * Stagger item (use with staggerContainer)
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getReducedMotionDuration(0.4),
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

/**
 * Scale animation for CTAs - respects prefers-reduced-motion
 */
export const scaleOnHover = {
  scale: 1.05,
  transition: {
    duration: getReducedMotionDuration(0.2),
    ease: "easeOut",
  },
}

/**
 * Scale down on active - respects prefers-reduced-motion
 */
export const scaleOnActive = {
  scale: 0.95,
  transition: {
    duration: getReducedMotionDuration(0.1),
    ease: "easeOut",
  },
}
