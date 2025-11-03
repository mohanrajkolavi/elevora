import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect only app routes (not marketing/pricing pages)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/content(.*)',
  '/schedule(.*)',
  '/analytics(.*)',
  '/settings(.*)',
]);

// Public routes that don't need auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/marketing(.*)',
  '/pricing(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect app routes only
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};