import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";

export async function getBookings() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return [];

    const { data: bookings } = await supabase
        .from("bookings")
        .select(`
            id,
            status,
            event_start,
            event_end,
            notes,
            created_at,
            profiles (
                full_name,
                email,
                phone
            ),
            vendors!inner (
                name,
                tenant_id
            ),
            vendor_packages (
                name,
                price
            )
        `)
        .eq("vendors.tenant_id", tenant.id)
        .order("event_start", { ascending: true });

    return bookings || [];
}
