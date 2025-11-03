import * as React from "react"
import { cn } from "@/lib/utils"

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div"
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, as = "p", children, ...props }, ref) => {
    const Component = as
    return React.createElement(
      Component,
      { className: cn(className), ref, ...props },
      children
    )
  }
)
Typography.displayName = "Typography"

export { Typography }

// Convenience components
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1 ref={ref} className={cn("text-4xl md:text-5xl font-bold tracking-tight", className)} {...props} />
))
H1.displayName = "H1"

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-3xl md:text-4xl font-semibold tracking-tight", className)} {...props} />
))
H2.displayName = "H2"

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl md:text-3xl font-semibold tracking-tight", className)} {...props} />
))
H3.displayName = "H3"

export const Body = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-base leading-7", className)} {...props} />
))
Body.displayName = "Body"

export const Small = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-sm leading-6", className)} {...props} />
))
Small.displayName = "Small"
