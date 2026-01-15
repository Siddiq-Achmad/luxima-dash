import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    Calendar,
} from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export default async function DashboardPage() {
    const stats = await getDashboardStats();

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 max-h-[400px]">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                            Chart Placeholder (Chart.js / Recharts)
                        </div>
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
                            {stats.recentBookings.map((booking: any) => (
                                <div key={booking.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>
                                            {booking.profiles?.full_name?.substring(0, 2).toUpperCase() || "??"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {booking.profiles?.full_name || "Unknown User"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.vendors?.name}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {new Date(booking.event_start).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
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
