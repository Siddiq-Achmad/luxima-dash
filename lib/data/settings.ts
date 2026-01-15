import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { DUMMY_SETTINGS } from "@/lib/dummy-data";

export async function getTenantSettings() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return DUMMY_SETTINGS;

    const { data } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenant.id)
        .single();

    // If we have a tenant from getCurrentTenant, we should have data.
    // But if somehow retrieval fails or tenant is bare bones?
    // User requested dummy fallback if "no data".
    // Since we are auth'd as tenant, replacing *real* settings with dummy is risky if name is just empty.
    // But if row is missing (unlikely if auth passed), DUMMY.

    if (!data) return DUMMY_SETTINGS;

    return {
        name: data.name,
        subdomain: data.subdomain,
        billing_email: data.billing_email,
        description: data.description,
        logoUrl: data.logo_url,
        // ... other settings
    };
}
