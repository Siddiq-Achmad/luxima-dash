import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    DollarSign,
    Users,
    Calendar,
} from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OverviewChart } from "@/components/dashboard/analytics/charts";
import { DUMMY_UMAMI_DATA } from "@/lib/dummy-data";
import { getCurrentUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

interface DashboardBooking {
    id: string;
    event_start: string;
    status: string;
    vendors?: { name: string } | { name: string }[];
    profiles?: { full_name?: string | null; avatar_url?: string | null } | { full_name?: string | null; avatar_url?: string | null }[];
}

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    // const user = await getCurrentUser();

    // if (!user) {
    //     return redirect("/unauthorized");
    // }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats.growth}% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            Upcoming scheduled events
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all services
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                            Real-time analytics coming soon
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 max-h-[400px]">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={stats.graphData || DUMMY_UMAMI_DATA.overview} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Your latest {stats.recentBookings.length} bookings
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentBookings.map((booking: DashboardBooking) => {
                                const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
                                const vendor = Array.isArray(booking.vendors) ? booking.vendors[0] : booking.vendors;

                                return (
                                    <div key={booking.id} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>
                                                {profile?.full_name?.substring(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {profile?.full_name || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {vendor?.name}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {new Date(booking.event_start).toLocaleDateString()}
                                        </div>
                                    </div>
                                );
                            })}
                            {stats.recentBookings.length === 0 && (
                                <div className="text-center text-sm text-muted-foreground">
                                    No recent bookings found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
