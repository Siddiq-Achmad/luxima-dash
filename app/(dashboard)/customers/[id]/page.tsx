import { getCustomerById } from "@/lib/actions/customer";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, Phone, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { id } = await params;
    const customer = await getCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/customers">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Details</h1>
                    <p className="text-muted-foreground">View information for {customer.full_name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={customer.avatar_url} />
                                <AvatarFallback className="text-2xl">{customer.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle>{customer.full_name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2 mt-2">
                            <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                                {customer.status.toUpperCase()}
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${customer.email}`} className="text-sm hover:underline">{customer.email}</a>
                        </div>
                        {customer.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${customer.phone}`} className="text-sm hover:underline">{customer.phone}</a>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Joined {new Date(customer.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Source</h3>
                                <p>{customer.source || "Unknown"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                                <div className="flex gap-2">
                                    {customer.tags && customer.tags.length > 0 ? (
                                        customer.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="flex items-center gap-1">
                                                <Tag className="h-3 w-3" /> {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No tags</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                                <p className="text-sm leading-relaxed">{customer.notes || "No notes available."}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity History</CardTitle>
                            <CardDescription>Recent interactions and bookings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground text-center py-8">
                                No recent activity found.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
