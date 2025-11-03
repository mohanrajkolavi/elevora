# Elevora

A Next.js 14 application with TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/(marketing)/` - Marketing/landing pages
- `app/(app)/` - Application pages (dashboard, content, schedule, analytics, settings)
- `components/ui/` - Shared UI components (shadcn/ui)
- `lib/` - Utilities (auth, db, validations, ai)
- `styles/` - Global styles and Tailwind configuration

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Clerk (Authentication)
- Supabase (Database)
- Stripe (Payments)
- React Query
- Zod (Validation)
- Sentry (Error Tracking)
- Plausible (Analytics)

## Features

- Custom Tailwind configuration with neutral gray palette
- Brand gradient (indigo → cyan)
- Rounded-2xl border radius
- Custom focus ring styles
- Responsive design
- Dark mode support (via CSS variables)
