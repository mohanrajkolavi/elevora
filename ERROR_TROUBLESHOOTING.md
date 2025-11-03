# Error Troubleshooting Guide

## Client-Side Exception

If you're seeing a client-side exception, check the following:

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** Restart your dev server after adding environment variables:
```bash
npm run dev
```

### 2. Common Client-Side Errors

#### "Clerk publishable key is not set"
- **Solution:** Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local`
- **Get your key:** https://dashboard.clerk.com → Your App → API Keys

#### "Supabase environment variables are not set"
- **Solution:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- **Get your keys:** https://app.supabase.com → Your Project → Settings → API

#### Hydration Mismatch Error
- **Fixed:** ThemeProvider now handles hydration correctly
- If you still see this, clear your browser cache and localStorage

#### "useTheme must be used within a ThemeProvider"
- **Cause:** Using `useTheme()` hook outside of ThemeProvider
- **Solution:** Wrap your component with ThemeProvider

### 3. Check Browser Console

Open your browser's Developer Tools (F12) and check:
- **Console tab:** For specific error messages
- **Network tab:** For failed API requests
- **Application tab:** Check localStorage for any corrupted data

### 4. Quick Fixes

1. **Clear browser cache and localStorage:**
   ```javascript
   // Run in browser console
   localStorage.clear()
   ```

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check if .env.local exists:**
   ```bash
   ls -la .env.local
   ```

4. **Verify environment variables are loaded:**
   - Check browser console for warnings
   - Variables starting with `NEXT_PUBLIC_` should be available client-side

### 5. Still Having Issues?

1. Check the exact error message in browser console
2. Verify all environment variables are set correctly
3. Ensure Clerk and Supabase projects are properly configured
4. Check network requests in browser DevTools for 401/403 errors

## Need Help?

If the error persists, share:
1. The exact error message from browser console
2. Which page/route you're on when it occurs
3. Your environment setup (have you added .env.local?)
