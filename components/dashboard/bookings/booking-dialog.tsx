"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea" 
import { createBooking, updateBooking } from "@/lib/actions/bookings";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Booking, Profile, VendorPackage } from "@/lib/types";

// Allow generic type for props to avoid circular deps or complex types
type BookingDialogProps = {
    mode?: "create" | "edit";
    booking?: Booking;
    customers: { profiles: Profile }[];
    packages: VendorPackage[];
    trigger?: React.ReactNode;
};

export function BookingDialog({ mode = "create", booking, customers, packages, trigger }: BookingDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // Construct data object matching schema
        const data = {
            user_id: formData.get("user_id") as string,
            package_id: formData.get("package_id") as string,
            event_start: formData.get("event_start") as string, // Check if this is datetime-local format
            event_end: formData.get("event_end") as string,
            notes: formData.get("notes") as string,
            status: formData.get("status") as string,
        };

        // basic validation
        if (!data.event_start || !data.event_end) {
            toast.error("Please select start and end times");
            setLoading(false);
            return;
        }

        let result;
        if (mode === "edit" && booking) {
            result = await updateBooking(booking.id, data);
        } else {
            result = await createBooking(data);
        }

        setLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(mode === "create" ? "Booking created" : "Booking updated");
            setOpen(false);
            router.refresh(); // Refresh server components
        }
    }

    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // Adjust for timezone offset to show local time in input
        // Or just slice ISO string if backend handles UTC correctly.
        // datetime-local expects YYYY-MM-DDThh:mm
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Booking
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "New Booking" : "Edit Booking"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Create a new booking for a customer."
                            : "Update booking details."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        {mode === "create" && (
                            <div className="grid gap-2">
                                <Label htmlFor="user_id">Customer</Label>
                                <Select name="user_id" required defaultValue={booking?.user_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c.profiles.id} value={c.profiles.id}>
                                                {c.profiles.full_name} ({c.profiles.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="package_id">Package</Label>
                            <Select name="package_id" defaultValue={booking?.package_id || booking?.vendor_packages?.id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a package" />
                                </SelectTrigger>
                                <SelectContent>
                                    {packages.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name} - {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(p.price)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="event_start">Start Time</Label>
                                <Input
                                    id="event_start"
                                    name="event_start"
                                    type="datetime-local"
                                    required
                                    defaultValue={formatDateForInput(booking?.event_start)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="event_end">End Time</Label>
                                <Input
                                    id="event_end"
                                    name="event_end"
                                    type="datetime-local"
                                    required
                                    defaultValue={formatDateForInput(booking?.event_end)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={booking?.status || "pending"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" name="notes" defaultValue={booking?.notes || ""} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Booking"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
