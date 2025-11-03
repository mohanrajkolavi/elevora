-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create enum types
CREATE TYPE workspace_member_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE post_platform AS ENUM ('x', 'linkedin', 'instagram', 'threads', 'bluesky', 'tiktok', 'newsletter');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'posted', 'failed');
CREATE TYPE billing_plan AS ENUM ('free', 'solo', 'pro', 'growth');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create workspace_members table
CREATE TABLE workspace_members (
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role workspace_member_role NOT NULL DEFAULT 'member',
  PRIMARY KEY (workspace_id, user_id)
);

-- Create voice_profiles table
CREATE TABLE voice_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  embedding vector(1536), -- Adjust dimension as needed for your embedding model
  notes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create generated_posts table
CREATE TABLE generated_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform post_platform NOT NULL,
  content JSONB NOT NULL,
  status post_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create billing_customers table
CREATE TABLE billing_customers (
  workspace_id UUID PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  plan billing_plan NOT NULL DEFAULT 'free',
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_workspaces_owner ON workspaces(owner);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_voice_profiles_workspace_id ON voice_profiles(workspace_id);
CREATE INDEX idx_generated_posts_workspace_id ON generated_posts(workspace_id);
CREATE INDEX idx_generated_posts_status ON generated_posts(status);
CREATE INDEX idx_generated_posts_scheduled_at ON generated_posts(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX idx_billing_customers_stripe_id ON billing_customers(stripe_customer_id);

-- Helper function to get current user ID from session
-- This function will be called with the user's UUID after Clerk authentication
CREATE OR REPLACE FUNCTION get_user_id_from_clerk_id(clerk_user_id TEXT)
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = clerk_user_id;
$$ LANGUAGE SQL STABLE;

-- Helper function to check workspace membership
CREATE OR REPLACE FUNCTION user_has_workspace_access(user_uuid UUID, workspace_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces WHERE id = workspace_uuid AND owner = user_uuid
  ) OR EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_id = workspace_uuid AND user_id = user_uuid
  );
$$ LANGUAGE SQL STABLE;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Deny all by default - application layer handles access control
-- In practice, server-side code will use service role key
CREATE POLICY "Deny all access to users"
  ON users FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for workspaces table
-- Deny all by default - application layer handles access control
CREATE POLICY "Deny all access to workspaces"
  ON workspaces FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for workspace_members table
-- Deny all by default - application layer handles access control
CREATE POLICY "Deny all access to workspace_members"
  ON workspace_members FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for voice_profiles table
-- Deny all by default - application layer handles access control
CREATE POLICY "Deny all access to voice_profiles"
  ON voice_profiles FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for generated_posts table
-- Deny all by default - application layer handles access control
CREATE POLICY "Deny all access to generated_posts"
  ON generated_posts FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for billing_customers table
-- Deny all by default - application layer handles access control
CREATE POLICY "Deny all access to billing_customers"
  ON billing_customers FOR ALL
  USING (false)
  WITH CHECK (false);

-- Note: Since we're using Clerk for authentication, RLS policies are restrictive
-- All data access should go through the application layer using the service role key
-- The application layer (lib/supabase/server.ts) should validate user permissions
-- before making database queries
