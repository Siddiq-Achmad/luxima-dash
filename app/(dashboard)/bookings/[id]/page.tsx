import { getBookingById } from "@/lib/actions/bookings";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, Package, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
    const { id } = await params;
    const booking = await getBookingById(id);

    if (!booking) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <span className="font-mono text-xs">{booking.id}</span>
                    <span>•</span>
                    <Badge variant={
                        booking.status === "confirmed" ? "default" :
                            booking.status === "completed" ? "secondary" :
                                booking.status === "cancelled" ? "destructive" : "outline"
                    }>
                        {booking.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Event Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Date</span>
                            <p className="font-medium">{format(new Date(booking.event_start), 'PPP')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Start Time</span>
                                <p className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(booking.event_start), 'p')}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">End Time</span>
                                <p className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(booking.event_end), 'p')}
                                </p>
                            </div>
                        </div>
                        {booking.notes && (
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Notes</span>
                                <p className="text-sm mt-1 bg-muted p-2 rounded-md">{booking.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Customer Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {booking.profiles ? (
                            <>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                                    <p className="font-medium">{booking.profiles.full_name}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                                    <p>{booking.profiles.email}</p>
                                </div>
                                {booking.profiles.id && (
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Profile ID</span>
                                        <p className="text-xs text-muted-foreground">{booking.profiles.id}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground">Customer details not available</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Package Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {booking.vendor_packages ? (
                            <>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Package Name</span>
                                    <p className="font-medium">{booking.vendor_packages.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Price</span>
                                    <p className="font-bold text-lg text-primary">{formatCurrency(booking.vendor_packages.price)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Description</span>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{booking.vendor_packages.description}</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">Package details not available</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
