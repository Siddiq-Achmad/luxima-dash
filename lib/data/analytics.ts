import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { subMonths, format, eachDayOfInterval } from "date-fns";
import { DUMMY_ANALYTICS, DUMMY_UMAMI_DATA } from "@/lib/dummy-data";

export type AnalyticsData = {
    revenue: { date: string; amount: number }[];
    bookings: { date: string; count: number }[];
    topPackages: { name: string; count: number }[];
    umami: typeof DUMMY_UMAMI_DATA;
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    const dummyResponse = {
        ...DUMMY_ANALYTICS,
        umami: DUMMY_UMAMI_DATA
    };

    if (!tenant) {
        return dummyResponse;
    }

    // Get last 30 days range
    const today = new Date();
    const startDate = subMonths(today, 1);

    // 1. Revenue over time (daily)
    const { data: payments } = await supabase
        .from("payment_transactions")
        .select("amount, created_at")
        .eq("tenant_id", tenant.id)
        .eq("status", "completed")
        .gte("created_at", startDate.toISOString());

    // 2. Bookings over time (daily)
    const { data: bookings } = await supabase
        .from("bookings")
        .select("created_at, vendors!inner(tenant_id)")
        .eq("vendors.tenant_id", tenant.id)
        .gte("created_at", startDate.toISOString());

    // 3. Top Packages
    const { data: packages } = await supabase
        .from("bookings")
        .select(`
            vendor_packages (
                name
            ),
            vendors!inner(tenant_id)
        `)
        .eq("vendors.tenant_id", tenant.id);

    // Check if everything is empty
    const isEmpty = (!payments || payments.length === 0) && (!bookings || bookings.length === 0) && (!packages || packages.length === 0);

    if (isEmpty) {
        return dummyResponse;
    }

    // Group by day
    const revenueMap = new Map<string, number>();
    payments?.forEach(p => {
        const day = format(new Date(p.created_at!), "yyyy-MM-dd");
        revenueMap.set(day, (revenueMap.get(day) || 0) + Number(p.amount));
    });

    const dates = eachDayOfInterval({ start: startDate, end: today });
    const revenueStats = dates.map(date => {
        const day = format(date, "yyyy-MM-dd");
        return {
            date: format(date, "d MMM"),
            amount: revenueMap.get(day) || 0
        };
    });

    const bookingsMap = new Map<string, number>();
    bookings?.forEach(b => {
        const day = format(new Date(b.created_at!), "yyyy-MM-dd");
        bookingsMap.set(day, (bookingsMap.get(day) || 0) + 1);
    });

    const bookingStats = dates.map(date => {
        const day = format(date, "yyyy-MM-dd");
        return {
            date: format(date, "d MMM"),
            count: bookingsMap.get(day) || 0
        };
    });

    const packageCounts: Record<string, number> = {};
    packages?.forEach((p) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const name = (p as any).vendor_packages?.name || "Custom";
        packageCounts[name] = (packageCounts[name] || 0) + 1;
    });

    const topPackages = Object.entries(packageCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        revenue: revenueStats,
        bookings: bookingStats,
        topPackages,
        umami: DUMMY_UMAMI_DATA // Always return dummy Umami for now
    };
}
