import { DUMMY_PACKAGES } from "@/lib/dummy-data";
import { getPackageById } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, ChevronLeft, Package as PackageIcon, Clock, Users, Minus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PackageDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Try DB first
    let pkg = await getPackageById(id);

    // Fallback
    if (!pkg) {
        pkg = DUMMY_PACKAGES.find((p) => p.id === id) || null;
    }

    if (!pkg) {
        notFound();
    }

    const features = Array.isArray(pkg.features) ? pkg.features : [];
    const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions : [];
    const exclusions = Array.isArray(pkg.exclusions) ? pkg.exclusions : [];

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/packages">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Package Details</h1>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <PackageIcon className="h-6 w-6 text-primary" />
                                {pkg.name}
                            </CardTitle>
                            <CardDescription>
                                {pkg.description || "No description provided."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary mb-6">
                                {formatCurrency(pkg.price)}
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    {pkg.currency || "IDR"}
                                </span>
                            </div>

                            <div className="flex gap-6 mb-6">
                                {pkg.duration_hours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{pkg.duration_hours} Hours</span>
                                    </div>
                                )}
                                {pkg.max_guests && (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Up to {pkg.max_guests} Guests</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Features & Inclusions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {features.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Key Features</h3>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-sm">{String(feature)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {inclusions.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Inclusions</h3>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {inclusions.map((inc, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-sm">{String(inc)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {exclusions.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Exclusions</h3>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {exclusions.map((exc, i) => (
                                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                                <Minus className="h-5 w-5 shrink-0 mt-0.5" />
                                                <span className="text-sm">{String(exc)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                                    {pkg.status || 'Active'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">ID</span>
                                <span className="text-sm font-mono truncate max-w-[100px]" title={pkg.id}>{pkg.id}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Vendor ID</span>
                                <span className="text-sm font-mono truncate max-w-[100px]" title={pkg.vendor_id}>{pkg.vendor_id}</span>
                            </div>
                            <Button className="w-full mt-4">Edit Package</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
