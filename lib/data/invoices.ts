import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";

export async function getInvoices() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return [];

    const { data: invoices } = await supabase
        .from("invoices")
        .select(`
            id,
            invoice_number,
            amount,
            status,
            due_date,
            created_at,
            paid_at,
            subscriptions (
               plan_id,
               subscription_plans (
                 name
               )
            )
        `)
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });

    return invoices || [];
}
