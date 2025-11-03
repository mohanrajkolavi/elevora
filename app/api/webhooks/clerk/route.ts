import { Webhook } from "svix"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { WebhookEvent } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/lib/supabase/types"

// Helper to safely update users table
async function updateUser(clerkId: string, email: string) {
  const supabase = createAdminClient()
  const query = (supabase
    .from("users") as any)
    .update({ email } as any)
    .eq("clerk_id", clerkId) as any
  
  return await query
}

export async function POST(req: Request) {
  const payload = await req.text()
  const headerPayload = await headers()
  
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  try {
    const event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent

    const supabase = createAdminClient()

    // When a new user is created in Clerk
    if (event.type === "user.created") {
      const { id, email_addresses } = event.data
      
      const { error } = await supabase
        .from("users")
        .insert({
          clerk_id: id,
          email: email_addresses[0]?.email_address || "",
        } as any)

      if (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({ error: "Error creating user" }, { status: 500 })
      }
    }

    // When a user is updated in Clerk
    if (event.type === "user.updated") {
      const { id, email_addresses } = event.data
      const { error } = await updateUser(id, email_addresses[0]?.email_address || "")

      if (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Error updating user" }, { status: 500 })
      }
    }

    // When a user is deleted in Clerk
    if (event.type === "user.deleted") {
      const { id } = event.data
      
      if (!id) {
        return NextResponse.json({ error: "Missing user id" }, { status: 400 })
      }
      
      const { error } = await (supabase
        .from("users")
        .delete()
        .eq("clerk_id", id) as any)

      if (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
      }
    }

    return NextResponse.json({ status: "success" })
  } catch (err: any) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
