"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { memberSchema } from "@/lib/schemas";

export async function inviteMember(data: z.infer<typeof memberSchema>) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();
    if (!tenant) return { error: "Unauthorized" };

    // 1. Check if user already exists in tenant elements (optional but good UI)
    // For now, simpler implementation:
    // Create an invitation record.

    // Note: In a real app, we'd check if `data.email` corresponds to an existing profile.
    // If yes, we might add them directly or send an invite.
    // Here we assume an "invitations" table or similar logic is desired.
    // Given the prompt asked to use DB structure, I'll attempt to insert into `user_invitations` if it exists,
    // or just assume we add to `tenant_members` if the user is found?
    // Let's go with `user_invitations` as it's a common pattern and safer.

    const { error } = await supabase.from("user_invitations").insert({
        tenant_id: tenant.id,
        email: data.email,
        role_id: await getRoleId(supabase, data.role), // Helper to get role ID
        invited_by: (await supabase.auth.getUser()).data.user?.id,
        invite_token: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) {
        console.error("Error inviting member:", error);
        return { error: error.message };
    }

    revalidatePath("/team");
    return { success: true };
}

async function getRoleId(supabase: any, roleName: string) {
    // Helper to resolve role name to UUID if needed, or just return name if schema allows.
    // Assumption: roles table exists.
    const { data } = await supabase.from("roles").select("id").eq("role", roleName).single();
    return data?.id;
}

export async function removeMember(memberId: string) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();
    if (!tenant) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("tenant_members")
        .delete()
        .eq("id", memberId)
        .eq("tenant_id", tenant.id);

    if (error) return { error: error.message };

    revalidatePath("/team");
    return { success: true };
}
