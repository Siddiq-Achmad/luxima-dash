import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Plus } from "lucide-react";
import { getBookings } from "@/lib/data/bookings";
import { format } from "date-fns";

export default async function BookingsPage() {
    const bookings = await getBookings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
                    <p className="text-muted-foreground">
                        Manage your upcoming and past bookings
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Booking
                </Button>
            </div>

            <div className="grid gap-4">
                {bookings.map((booking: any) => (
                    <Card key={booking.id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        {booking.vendor_packages?.name || "Custom Code"}
                                    </CardTitle>
                                    <CardDescription>{booking.vendors?.name}</CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        booking.status === "confirmed" ? "default" : "secondary"
                                    }
                                >
                                    {booking.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {booking.profiles?.full_name || "Unknown"}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {booking.profiles?.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {format(new Date(booking.event_start), "MMM d, yyyy")}
                                        </div>
                                        <div className="text-muted-foreground">Date</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {format(new Date(booking.event_start), "HH:mm")} - {format(new Date(booking.event_end), "HH:mm")}
                                        </div>
                                        <div className="text-muted-foreground">Time</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(booking.vendor_packages?.price || 0)}
                                        </div>
                                        <div className="text-muted-foreground">Price</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {bookings.length === 0 && (
                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                        <p className="text-muted-foreground">No bookings found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
