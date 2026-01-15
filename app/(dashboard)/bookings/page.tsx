import { getBookings, getPackages } from "@/lib/data/bookings";
import { getTeamMembers } from "@/lib/data/team"; // Reusing team members as customers list
import { BookingList } from "@/components/dashboard/bookings/booking-list";
import { BookingDialog } from "@/components/dashboard/bookings/booking-dialog";

export default async function BookingsPage() {
    const [bookings, packages, customers] = await Promise.all([
        getBookings(),
        getPackages(),
        getTeamMembers()
    ]);

    // Filter customers with profiles for the components that require them
    const validCustomers = customers
        .filter(c => c.profiles !== null && c.profiles !== undefined)
        .map(c => ({ profiles: c.profiles! }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
                    <p className="text-muted-foreground">
                        Manage your upcoming and past bookings
                    </p>
                </div>
                <BookingDialog customers={validCustomers} packages={packages} />
            </div>

            <BookingList bookings={bookings} customers={validCustomers} packages={packages} />
        </div>
    );
}
