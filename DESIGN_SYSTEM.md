# Elevora Design System

A comprehensive design system built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Typography Scale

### Headings
- **H1**: `text-4xl md:text-5xl font-bold` - Used for main page titles
- **H2**: `text-3xl md:text-4xl font-semibold` - Used for section headings
- **H3**: `text-2xl md:text-3xl font-semibold` - Used for subsection headings

### Body Text
- **Body**: `text-base leading-7` - Default paragraph text
- **Small**: `text-sm leading-6` - Used for captions and fine print

### Usage
```tsx
import { H1, H2, H3, Body, Small } from "@/components/ui/typography"

<H1>Main Title</H1>
<H2>Section Title</H2>
<Body>Regular paragraph text</Body>
<Small>Small text for captions</Small>
```

## Button Variants

- **primary**: Main call-to-action button with hover scale effect
- **secondary**: Secondary action button
- **ghost**: Minimal button with hover background
- **destructive**: For dangerous actions (delete, remove, etc.)
- **outline**: Bordered button
- **link**: Text button that looks like a link
- **brand**: Gradient button using brand colors

### Usage
```tsx
import { Button } from "@/components/ui/button"

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

## UI Components

All shadcn/ui components are available:
- **Card**: Container with rounded corners
- **Badge**: Small status indicators
- **Alert**: Informational messages
- **Tooltip**: Hover information
- **Dialog**: Modal dialogs
- **Sheet**: Slide-out panels
- **Tabs**: Tabbed interfaces
- **Toast**: Notification messages

## DataDisplay Components

### StatCard
Displays a metric with optional trend indicator, wrapped in a card with animation.

```tsx
import { StatCard } from "@/components/datadisplay"

<StatCard
  label="Total Users"
  value="12,345"
  trend={{ direction: "up", value: "+12%" }}
  description="Compared to last month"
  icon={<TrendingUp />}
/>
```

### KPI
Key Performance Indicator component.

```tsx
import { KPI } from "@/components/datadisplay"

<KPI
  label="Revenue"
  value="$45,678"
  trend={{ direction: "up", value: "+8%" }}
/>
```

### TrendPill
Small indicator showing trend direction (↑ or ↓).

```tsx
import { TrendPill } from "@/components/datadisplay"

<TrendPill trend="up" value="+12%" />
<TrendPill trend="down" value="-5%" variant="danger" />
```

## Motion & Animation

### Framer Motion Utilities

All animations respect `prefers-reduced-motion` preference.

#### fadeInUp
Fades in and slides up from below.

```tsx
import { MotionWrapper } from "@/components/ui/motion-wrapper"

<MotionWrapper variant="fadeInUp">
  <YourContent />
</MotionWrapper>
```

#### Stagger Children
Animates children in sequence.

```tsx
import { MotionWrapper, StaggerItem } from "@/components/ui/motion-wrapper"

<MotionWrapper variant="stagger">
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</MotionWrapper>
```

#### Hover Scale on CTAs
Buttons with `variant="primary"` or `variant="brand"` automatically have hover scale effect.

The `.cta-hover` class provides:
- `scale(1.05)` on hover
- `scale(0.95)` on active
- Respects `prefers-reduced-motion`

## Color System

### CSS Variables

All colors are available as CSS variables for easy theming:

```css
/* Brand colors */
--brand: hsl(262, 83%, 58%);
--brand-foreground: hsl(0, 0%, 100%);

/* Status colors */
--success: hsl(142, 76%, 36%);
--warning: hsl(38, 92%, 50%);
--danger: hsl(0, 84.2%, 60.2%);
```

### Usage in Tailwind

```tsx
<div className="bg-brand text-brand-foreground">
<div className="bg-success text-success-foreground">
<div className="bg-warning text-warning-foreground">
<div className="bg-danger text-danger-foreground">
```

## Dark Mode

Dark mode is implemented using the `class` strategy with ThemeProvider.

### Usage

```tsx
import { ThemeProvider, useTheme } from "@/components/theme-provider"

// In your layout
<ThemeProvider defaultTheme="system" storageKey="elevora-theme">
  <YourApp />
</ThemeProvider>

// To toggle theme
const { theme, setTheme } = useTheme()
setTheme(theme === "dark" ? "light" : "dark")
```

## Accessibility

### Focus States
All interactive elements have accessible focus rings:
- Uses `focus-visible` for keyboard navigation only
- Visible ring offset for contrast
- Can be customized with `.focus-ring` utility class

### Reduced Motion
All animations respect `prefers-reduced-motion`:
- CSS animations are disabled when user prefers reduced motion
- JavaScript animations use near-zero durations
- Ensures better accessibility for motion-sensitive users

## Design Tokens

### Border Radius
- Default: `1rem` (rounded-2xl)
- Medium: `calc(var(--radius) - 2px)`
- Small: `calc(var(--radius) - 4px)`

### Brand Gradient
- From: Indigo-600 (`rgb(79, 70, 229)`)
- To: Cyan-500 (`rgb(6, 182, 212)`)
- Direction: 135deg (top-left to bottom-right)

```tsx
<div className="bg-gradient-brand text-white">
  Brand gradient background
</div>
```

## File Structure

```
components/
  ui/              # shadcn/ui components
    button.tsx
    card.tsx
    badge.tsx
    alert.tsx
    tooltip.tsx
    dialog.tsx
    sheet.tsx
    tabs.tsx
    toast.tsx
    typography.tsx
    motion-wrapper.tsx
  datadisplay/     # Custom data display components
    stat-card.tsx
    kpi.tsx
    trend-pill.tsx
    index.ts
  theme-provider.tsx

lib/
  motion.ts        # Motion utilities
  utils.ts         # Utility functions

styles/
  globals.css      # Global styles and CSS variables
```

