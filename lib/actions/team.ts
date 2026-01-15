"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const memberSchema = z.object({
    email: z.string().email(),
    role: z.string(), // role_id really, or we map name to id
});

export async function inviteMember(data: z.infer<typeof memberSchema>) {
    // This typically involves:
    // 1. Creating a user_invitations record
    // 2. Sending an email
    // For now, we'll just mock the DB insertion part if user doesn't exist?
    // Or if user exists, add directly to tenant_members?
    // Let's stick to user_invitations logic if possible, or just add directly for simplicity if profile exists.

    // Simplified: Check if user exists with that email.
    // If yes, add to tenant_members.
    // If no, create invitation (omitted for brevity unless requested).

    const supabase = await createClient();
    const tenant = await getCurrentTenant();
    if (!tenant) return { error: "Unauthorized" };

    // 1. Find user by email (Requires admin privileges usually or a secure function)
    const { data: users } = await supabase
        .from("profiles") // Profiles usually has email if we synced it? Or users table?
        // Accessing 'users' table (auth.users) is restricted.
        // We really should use `user_invitations`.
        // Let's implement `user_invitations` insert.
        .select("id"); // Placeholder logic

    const { error } = await supabase.from("user_invitations").insert({
        tenant_id: tenant.id,
        email: data.email,
        role_id: JSON.stringify({ role: data.role }), // Schema says role_id is Json? Let's check schema.
        // Schema: role_id Json
        // invited_by: ...
        invited_by: (await supabase.auth.getUser()).data.user?.id,
        invite_token: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    if (error) return { error: error.message };

    revalidatePath("/team");
    return { success: true };
}

export async function removeMember(memberId: string) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();
    if (!tenant) return { error: "Unauthorized" };

    // Ensure member belongs to tenant
    const { error } = await supabase
        .from("tenant_members")
        .delete()
        .eq("id", memberId)
        .eq("tenant_id", tenant.id);

    if (error) return { error: error.message };

    revalidatePath("/team");
    return { success: true };
}
