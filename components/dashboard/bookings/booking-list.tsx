"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { BookingDialog } from "./booking-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import Link from "next/link";

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

    // Stats
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === "confirmed").length;
    const pending = bookings.filter(b => b.status === "pending").length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" >
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{total}</div>
                        <div className="text-sm text-muted-foreground">Total Bookings</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{confirmed}</div>
                        <div className="text-sm text-muted-foreground">Confirmed</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{pending}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{cancelled}</div>
                        <div className="text-sm text-muted-foreground">Cancelled</div>
                    </div>
                </Card>
            </div >

            {/* Table */}
            < div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden p-4" >
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-muted/20">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            <TableHead className="py-4 font-semibold w-[300px]">Service & Vendor</TableHead>
                            <TableHead className="py-4 font-semibold">Customer</TableHead>
                            <TableHead className="py-4 font-semibold">Date & Time</TableHead>
                            <TableHead className="py-4 font-semibold">Status</TableHead>
                            <TableHead className="py-4 font-semibold">Price</TableHead>
                            <TableHead className="py-4 font-semibold text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBookings.map((booking) => (
                            <TableRow key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-muted/20 border-gray-100 dark:border-border">
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                            {booking.vendor_packages?.name || "Custom Package"}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {booking.vendors?.name}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                            {booking.profiles?.full_name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{booking.profiles?.full_name || "Unknown"}</div>
                                            <div className="text-xs text-muted-foreground">{booking.profiles?.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium">{format(new Date(booking.event_start), "MMM d, yyyy")}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(booking.event_start), "HH:mm")} - {format(new Date(booking.event_end), "HH:mm")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        variant="outline"
                                        className={`capitalize border-0 ${booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                                            booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 font-medium">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(booking.vendor_packages?.price || 0)}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Link href={`/bookings/${booking.id}`} className="flex items-center w-full">
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <BookingDialog
                                                mode="edit"
                                                booking={booking}
                                                customers={customers}
                                                packages={packages}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <AlertDialog open={deletingId === booking.id} onOpenChange={(open) => setDeletingId(open ? booking.id : null)}>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div >

            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
}
