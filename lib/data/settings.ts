import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";

export async function getTenantSettings() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return null;

    const { data } = await supabase
        .from("tenants")
        .select(`
            id,
            name,
            slug,
            subdomain,
            billing_email,
            settings,
            created_at
        `)
        .eq("id", tenant.id)
        .single();

    return data;
}
