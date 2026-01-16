import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { TenantMember } from "@/lib/types";

export async function getTeamMembers(): Promise<TenantMember[]> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return [];

    const { data: members, error } = await supabase
        .from("tenant_members")
        .select(`
            id,
            role_id,
            joined_at,
            status,
            profile_id,
            roles (
                name,
                role
            ),
            profiles (
                id,
                full_name,
                email,
                avatar_url
            )
        `)
        .eq("tenant_id", tenant.id);

    if (error || !members) {
        console.error("Error fetching team members:", error);
        return [];
    }

    return members.map(m => ({
        ...m,
        // Map nested relations to flat structure if needed by UI types, or update UI types to match.
        // The type definition I updated earlier allows `roles` and `profiles`.
        // However, `role` string on TenantMember might be expected by UI component.
        // Let's normalize it.
        role: (m.roles as unknown as { role: string })?.role || "member",
        profiles: m.profiles
    })) as unknown as TenantMember[];
}
