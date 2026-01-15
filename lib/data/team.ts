import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";

export async function getTeamMembers() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return [];

    const { data: members } = await supabase
        .from("tenant_members")
        .select(`
            id,
            role_tier,
            status,
            joined_at,
            profiles (
                full_name,
                email,
                avatar_url
            ),
            roles (
                name,
                role
            )
        `)
        .eq("tenant_id", tenant.id)
        .order("joined_at", { ascending: false });

    return members || [];
}
