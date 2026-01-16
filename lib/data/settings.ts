import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { DUMMY_SETTINGS } from "@/lib/dummy-data";

export async function getTenantSettings() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return null;

    const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", tenant.id)
        .single();

    if (error) {
        console.error("Error fetching tenant settings:", error);
        return null; // Or return partial default
    }

    return {
        name: data.name,
        subdomain: data.subdomain,
        billing_email: data.billing_email,
        description: data.description,
        logoUrl: data.logo_url,
        settings: data.settings,
        slug: data.slug,
        status: data.status
    };
}
