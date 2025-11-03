# Elevora Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Go to Webhooks → Add Endpoint
5. Set endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
6. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
7. Copy the webhook signing secret

## Supabase Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy your project URL and anon key
5. Copy your service role key (keep this secret!)
6. Go to SQL Editor
7. Run the migration file: `supabase/migrations/20240101000000_initial_schema.sql`

### Running Migrations

Option 1: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Option 2: Using Supabase Dashboard
1. Go to SQL Editor in Supabase Dashboard
2. Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Paste and run in the SQL Editor

## Database Schema

The migration creates the following tables:

- **users**: Stores user information linked to Clerk IDs
- **workspaces**: Workspace/organization entities
- **workspace_members**: Many-to-many relationship with roles
- **voice_profiles**: AI voice profiles with embeddings
- **generated_posts**: Social media posts with scheduling
- **billing_customers**: Stripe billing information

## Row Level Security (RLS)

All tables have RLS enabled with deny-by-default policies. All data access goes through the application layer using the service role key, which validates user permissions before making queries.

## Authentication Flow

1. User signs in/up via Clerk
2. Clerk webhook creates/updates user in Supabase `users` table
3. Middleware protects all `/dashboard`, `/content`, etc. routes
4. App routes use `syncUserToDatabase()` to ensure user exists
5. Server components use `createServerClientWithAuth()` for database access

## Testing

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign Up" to create an account
4. After signup, you'll be redirected to `/dashboard`
5. Check Supabase dashboard to verify user was created

## Troubleshooting

### User not syncing to database
- Check Clerk webhook is configured correctly
- Verify webhook secret in `.env.local`
- Check webhook logs in Clerk dashboard

### RLS errors
- All database operations use the service role key (admin client)
- Application layer handles permission validation
- RLS is set to deny-all for additional security layer

### TypeScript errors
- Run `npm run build` to check for type errors
- Ensure all environment variables are set
- Check that Supabase migration ran successfully
