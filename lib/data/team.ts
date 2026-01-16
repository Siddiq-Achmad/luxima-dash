import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { DUMMY_TEAM } from "@/lib/dummy-data";
import { TenantMember } from "@/lib/types";

export async function getTeamMembers(): Promise<TenantMember[]> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return DUMMY_TEAM;

    const { data: members } = await supabase
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

    if (!members || members.length === 0) {
        return DUMMY_TEAM;
    }

    return members.map(m => ({
        ...m,
        role: (m.roles as unknown as { role: string })?.role || "member" // Normalize role
    })) as unknown as TenantMember[];
}
