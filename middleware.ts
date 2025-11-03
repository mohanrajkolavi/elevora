import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Protect all routes under /dashboard, /content, /schedule, /analytics, /settings
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/content(.*)",
  "/schedule(.*)",
  "/analytics(.*)",
  "/settings(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  // Protect app routes - redirect to sign-in if not authenticated
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
