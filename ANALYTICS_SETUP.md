# Analytics Setup Guide

## Plausible Analytics Integration

This project uses Plausible Analytics for privacy-friendly, cookie-free tracking.

### Environment Variables

Add to your `.env.local` (for local development, this is optional):
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

For production on Vercel, add this as an environment variable in your project settings.

### Events Tracked

The following events are currently tracked:

1. **`hero_signup_click`** - User clicks "Start Free" in hero section
   - Props: `{ location: "hero" | "final_cta" }`

2. **`demo_started`** - User starts the interactive demo
   - Props: `{ niche: string }` - The niche the user entered

3. **`pricing_clicked`** - User clicks on a pricing plan CTA
   - Props: `{ plan: "solo" | "pro" | "agency", price: string }`

4. **`demo_scroll`** - User clicks "See Demo" button
   - Props: `{ location: "hero" | "final_cta" }`

### Local Testing

In local development (when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is not set):
- Events are logged to the browser console with `[Analytics]` prefix
- No actual analytics calls are made
- Perfect for testing conversion flows

Example console output:
```
[Analytics] hero_signup_click { location: "hero" }
[Analytics] demo_started { niche: "fitness coaches" }
[Analytics] pricing_clicked { plan: "pro", price: "$49" }
```

### Production Deployment

1. Sign up for Plausible Analytics (https://plausible.io)
2. Add your domain in Plausible dashboard
3. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable in Vercel
4. The Plausible script will automatically load and track events

### Verification

To verify analytics are working:

1. **Local**: Check browser console for `[Analytics]` logs
2. **Production**: 
   - Check Network tab for requests to `plausible.io/api/event`
   - View events in your Plausible dashboard
   - Use browser devtools to see `window.plausible` is defined

### Privacy

Plausible is privacy-friendly by default:
- ✅ No cookies required
- ✅ No personal data collected
- ✅ GDPR compliant
- ✅ No cross-site tracking
- ✅ Open source

