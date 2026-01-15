import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { DUMMY_BOOKINGS, DUMMY_PACKAGES } from "@/lib/dummy-data";
import { Booking, VendorPackage } from "@/lib/types";

export async function getBookings(): Promise<Booking[]> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return DUMMY_BOOKINGS;

    const { data: bookings } = await supabase
        .from("bookings")
        .select(`
            id,
            status,
            event_start,
            event_end,
            notes,
            user_id,
            package_id,
            vendor_id,
            profiles (
                id,
                full_name,
                email
            ),
            vendors!inner (
                id,
                name,
                tenant_id
            ),
            vendor_packages (
                id,
                name,
                price
            )
        `)
        .eq("vendors.tenant_id", tenant.id)
        .order("event_start", { ascending: true });

    if (!bookings || bookings.length === 0) {
        return DUMMY_BOOKINGS;
    }

    return bookings as unknown as Booking[];
}

export async function getPackages(): Promise<VendorPackage[]> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return DUMMY_PACKAGES;

    const { data: packages } = await supabase
        .from("vendor_packages")
        .select("id, name, price, vendors!inner(tenant_id)")
        .eq("vendors.tenant_id", tenant.id);

    if (!packages || packages.length === 0) {
        return DUMMY_PACKAGES;
    }

    return packages as VendorPackage[];
}
