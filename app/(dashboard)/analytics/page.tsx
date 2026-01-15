import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getAnalyticsData } from "@/lib/data/analytics";
import {
    OverviewChart,
    DeviceStatsChart,
    BrowserStatsChart,
    OSStatsChart,
    TopPagesList,
    AnalyticsCharts
} from "@/components/dashboard/analytics/charts";
import { Eye, MousePointerClick, Users, Clock } from "lucide-react";

export default async function AnalyticsPage() {
    const stats = await getAnalyticsData();
    const { umami } = stats;

    const totalViews = umami.overview.reduce((acc, curr) => acc + curr.views, 0);
    const totalVisitors = umami.overview.reduce((acc, curr) => acc + curr.visitors, 0);
    const avgVisitDuration = "2m 34s"; // Dummy calculation

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">
                    Detailed insights about your audience and performance
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisitors}</div>
                        <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42.5%</div>
                        <p className="text-xs text-muted-foreground">-2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Visit Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgVisitDuration}</div>
                        <p className="text-xs text-muted-foreground">+10s from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Overview Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Traffic Overview</CardTitle>
                    <CardDescription>
                        Daily views and unique visitors
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <OverviewChart data={umami.overview} />
                </CardContent>
            </Card>

            {/* Detailed Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Devices (Pie) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Devices</CardTitle>
                        <CardDescription>Visitor device types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeviceStatsChart data={umami.devices} />
                    </CardContent>
                </Card>

                {/* OS (Radial) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Operating Systems</CardTitle>
                        <CardDescription>Visitor platforms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OSStatsChart data={umami.os} />
                    </CardContent>
                </Card>

                {/* Browsers (Bar) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Browsers</CardTitle>
                        <CardDescription>Top browsers used</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BrowserStatsChart data={umami.browsers} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Top Pages */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                        <CardDescription>Most visited pages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TopPagesList data={umami.pages} />
                    </CardContent>
                </Card>

                {/* Country List (Simple map replacement for now) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Countries</CardTitle>
                        <CardDescription>Visitor locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {umami.countries.map((country: any) => (
                                <div key={country.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">
                                            {/* Simple flag emoji mapping or placeholder for now */}
                                            {country.name === 'Indonesia' ? '🇮🇩' :
                                                country.name === 'Singapore' ? '🇸🇬' :
                                                    country.name === 'Malaysia' ? '🇲🇾' :
                                                        country.name === 'Australia' ? '🇦🇺' : '🌎'}
                                        </span>
                                        <span className="font-medium">{country.name}</span>
                                    </div>
                                    <span className="text-muted-foreground">{country.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Legacy Financial Charts (kept below for completeness if desired, or removed if strictly Umami focus. User said 'analytics graphs... like analytics umami'. Financial analytics usually separate. Keeping them but maybe labelled 'Business Analytics') */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Business Analytics</h3>
                <AnalyticsCharts revenueData={stats.revenue} bookingsData={stats.bookings} />
            </div>
        </div>
    );
}
