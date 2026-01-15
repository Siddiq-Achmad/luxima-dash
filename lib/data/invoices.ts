import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { DUMMY_INVOICES } from "@/lib/dummy-data";
import { Invoice } from "@/lib/types";

export async function getInvoices(): Promise<Invoice[]> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return DUMMY_INVOICES;

    const { data: invoices } = await supabase
        .from("invoices")
        .select(`
            *,
            subscriptions (
                subscription_plans (
                    name
                )
            ),
            profiles (
                full_name,
                email
            )
        `)
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });

    if (!invoices || invoices.length === 0) {
        return DUMMY_INVOICES;
    }

    return invoices as unknown as Invoice[];
}
