"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { BookingDialog } from "./booking-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBooking } from "@/lib/actions/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Booking, Profile, VendorPackage } from "@/lib/types";

type BookingListProps = {
    bookings: Booking[];
    customers: { profiles: Profile }[];
    packages: VendorPackage[];
};

export function BookingList({ bookings, customers, packages }: BookingListProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(id: string) {
        const res = await deleteBooking(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Booking deleted");
            router.refresh();
        }
        setDeletingId(null);
    }

    return (
        <div className="grid gap-4">
            {bookings.map((booking) => (
                <Card key={booking.id}>
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    {booking.vendor_packages?.name || "Custom Code"}
                                </CardTitle>
                                <CardDescription>{booking.vendors?.name}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        booking.status === "confirmed" ? "default" : "secondary"
                                    }
                                >
                                    {booking.status}
                                </Badge>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <BookingDialog
                                            mode="edit"
                                            booking={booking}
                                            customers={customers}
                                            packages={packages}
                                            trigger={
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                            }
                                        />
                                        <AlertDialog open={deletingId === booking.id} onOpenChange={(open) => setDeletingId(open ? booking.id : null)}>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the booking.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(booking.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
    );
}
