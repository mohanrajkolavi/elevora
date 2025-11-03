export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type WorkspaceMemberRole = "owner" | "admin" | "member"
export type PostPlatform = "x" | "linkedin" | "instagram" | "threads" | "bluesky" | "tiktok" | "newsletter"
export type PostStatus = "draft" | "scheduled" | "posted" | "failed"
export type BillingPlan = "free" | "solo" | "pro" | "growth"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          created_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          owner: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          owner: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          owner?: string
          name?: string
          created_at?: string
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: WorkspaceMemberRole
        }
        Insert: {
          workspace_id: string
          user_id: string
          role: WorkspaceMemberRole
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role?: WorkspaceMemberRole
        }
      }
      voice_profiles: {
        Row: {
          id: string
          workspace_id: string
          embedding: number[]
          notes: Json
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          embedding: number[]
          notes?: Json
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          embedding?: number[]
          notes?: Json
          created_at?: string
        }
      }
      generated_posts: {
        Row: {
          id: string
          workspace_id: string
          platform: PostPlatform
          content: Json
          status: PostStatus
          scheduled_at: string | null
          posted_at: string | null
          meta: Json | null
        }
        Insert: {
          id?: string
          workspace_id: string
          platform: PostPlatform
          content: Json
          status?: PostStatus
          scheduled_at?: string | null
          posted_at?: string | null
          meta?: Json | null
        }
        Update: {
          id?: string
          workspace_id?: string
          platform?: PostPlatform
          content?: Json
          status?: PostStatus
          scheduled_at?: string | null
          posted_at?: string | null
          meta?: Json | null
        }
      }
      billing_customers: {
        Row: {
          workspace_id: string
          stripe_customer_id: string
          plan: BillingPlan
          status: string
          current_period_end: string | null
        }
        Insert: {
          workspace_id: string
          stripe_customer_id: string
          plan?: BillingPlan
          status?: string
          current_period_end?: string | null
        }
        Update: {
          workspace_id?: string
          stripe_customer_id?: string
          plan?: BillingPlan
          status?: string
          current_period_end?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      workspace_member_role: WorkspaceMemberRole
      post_platform: PostPlatform
      post_status: PostStatus
      billing_plan: BillingPlan
    }
  }
}
