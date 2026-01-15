"use client";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Pie,
    PieChart,
    RadialBar,
    RadialBarChart,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// --- Configs ---

const trafficConfig = {
    views: {
        label: "Page Views",
        color: "var(--chart-1)",
    },
    visitors: {
        label: "Unique Visitors",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const deviceConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
    tablet: {
        label: "Tablet",
        color: "var(--chart-3)",
    },
    other: {
        label: "Other",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig;

const browserConfig = {
    Chrome: { label: "Chrome", color: "var(--chart-1)" },
    Safari: { label: "Safari", color: "var(--chart-2)" },
    Firefox: { label: "Firefox", color: "var(--chart-3)" },
    Edge: { label: "Edge", color: "var(--chart-4)" },
    Others: { label: "Others", color: "var(--chart-5)" },
} satisfies ChartConfig;

// --- Components ---

type GenericChartProps = {
    data: any[];
    title?: string;
    description?: string;
};

export function OverviewChart({ data }: GenericChartProps) {
    return (
        <ChartContainer config={trafficConfig} className="max-h-[260px] w-full">
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                    dataKey="visitors"
                    type="natural"
                    fill="var(--color-visitors)"
                    fillOpacity={0.4}
                    stroke="var(--color-visitors)"
                    stackId="a"
                />
                <Area
                    dataKey="views"
                    type="natural"
                    fill="var(--color-views)"
                    fillOpacity={0.4}
                    stroke="var(--color-views)"
                    stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
        </ChartContainer>
    );
}

export function DeviceStatsChart({ data }: GenericChartProps) {
    const chartData = data.map((item) => ({
        ...item,
        fill: `var(--color-${item.name.toLowerCase()})`,
    }));

    return (
        <ChartContainer
            config={deviceConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {chartData.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Visitors
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
        </ChartContainer>
    );
}

export function BrowserStatsChart({ data }: GenericChartProps) {
    const chartData = data.map((item) => ({
        ...item,
        fill: `var(--color-${item.name})`,
    }));

    return (
        <ChartContainer config={browserConfig} className="min-h-[200px] w-full">
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                    left: 0,
                }}
            >
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={80} // increased for labels
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" layout="vertical" radius={5} />
            </BarChart>
        </ChartContainer>
    );
}

export function OSStatsChart({ data }: GenericChartProps) {
    // Radial charts are tricky with config. Map data carefully.
    // For simplicity and robustness, stick to a Donut or Pie for OS too, or simple List.
    // But let's try Radial.
    const chartData = data.map((item, index) => ({
        ...item,
        fill: `var(--chart-${index + 1})`,
    }));

    const osConfig = {
        views: { label: "Visitors" },
        ...Object.fromEntries(data.map((d, i) => [d.name, { label: d.name, color: `var(--chart-${i + 1})` }]))
    } satisfies ChartConfig

    return (
        <ChartContainer
            config={osConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <RadialBarChart
                data={chartData}
                startAngle={-90}
                endAngle={380}
                innerRadius={30}
                outerRadius={110}
            >
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
                <RadialBar dataKey="count" background>
                </RadialBar>
                {/* Legend handled by container if valid */}
            </RadialBarChart>
        </ChartContainer>
    )
}

export function TopPagesList({ data }: { data: any[] }) {
    const maxViews = Math.max(...data.map(d => d.views));
    return (
        <div className="space-y-4">
            {data.map((page) => (
                <div key={page.path} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{page.path}</p>
                        <p className="text-sm text-muted-foreground">
                            {page.views} views
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        <div className="w-full bg-secondary h-2 rounded-full w-[100px] overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${Math.min((page.views / maxViews) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Legacy Re-export for compatibility if needed (but refactored to use new container if possible, or just standard recharts wrapper)
// For time efficiency, I will implement a basic version of AnalyticsCharts using the new system.

export function AnalyticsCharts({ revenueData, bookingsData }: { revenueData: any[], bookingsData: any[] }) {
    const revenueConfig = {
        amount: { label: "Revenue", color: "var(--chart-1)" }
    } satisfies ChartConfig;
    const bookingsConfig = {
        count: { label: "Bookings", color: "var(--chart-2)" }
    } satisfies ChartConfig;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Revenue (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={revenueConfig} className="max-h-[300px] w-full">
                        <BarChart data={revenueData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={{
                                    fill: "var(--color-text)",
                                    fontSize: 12,
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent formatter={(value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(value))} />} />
                            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Bookings (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={bookingsConfig} className="max-h-[300px] w-full">
                        <BarChart data={bookingsData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
