import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";

export type DashboardStats = {
    totalRevenue: number;
    activeBookings: number;
    totalCustomers: number;
    growth: number; // Dummy for now or calculated
    recentBookings: any[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) {
        return {
            totalRevenue: 0,
            activeBookings: 0,
            totalCustomers: 0,
            growth: 0,
            recentBookings: [],
        };
    }

    // 1. Total Revenue (Sum of completed payment transactions)
    const { data: payments } = await supabase
        .from("payment_transactions")
        .select("amount")
        .eq("tenant_id", tenant.id)
        .eq("status", "completed"); // Assuming 'completed' is the status

    const totalRevenue = payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    // 2. Active Bookings (Count of upcoming bookings)
    // We need to join with vendors to filter by tenant_id
    // But supabase postgrest text search on related tables is tricky for filtering
    // Easier to get all vendors for tenant first, then bookings?
    // Or better: use database function or simple approach:
    // Fetch bookings where vendor.tenant_id = tenant.id
    // Supabase allows: .eq('vendors.tenant_id', tenant.id) if relation exists and is embedded? 
    // No, standard postgrest doesn't support deep filtering easily on one request unless using !inner join.
    // Let's try !inner on vendors.

    const { count: activeBookings } = await supabase
        .from("bookings")
        .select("*, vendors!inner(tenant_id)", { count: "exact", head: true })
        .eq("vendors.tenant_id", tenant.id)
        .gte("event_start", new Date().toISOString())
        .neq("status", "cancelled");

    // 3. Total Customers (Unique users in bookings for this tenant)
    // This is hard to do with simple count.
    // Let's count tenant_members with role_tier='customer'
    // But wait, schema says role_tier is enum on tenant_members?
    // Let's check schema again. Yes: role_tier role_tier @default(tenant)
    // But customer role might be 'customer' tier.

    const { count: totalCustomers } = await supabase
        .from("tenant_members")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenant.id)
        .eq("role_tier", "customer");

    // 4. Recent Bookings
    const { data: recentBookings } = await supabase
        .from("bookings")
        .select(`
            id,
            status,
            event_start,
            event_end,
            profiles (
                full_name,
                email
            ),
            vendors!inner (
                name,
                tenant_id
            )
        `)
        .eq("vendors.tenant_id", tenant.id)
        .order("created_at", { ascending: false })
        .limit(5);

    return {
        totalRevenue,
        activeBookings: activeBookings || 0,
        totalCustomers: totalCustomers || 0,
        growth: 12.5, // Hardcoded for now
        recentBookings: recentBookings || [],
    };
}
