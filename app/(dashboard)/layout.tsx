import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, getCurrentTenant, getPendingBookingsCount } from "@/lib/auth/get-user";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    // Fetch user and tenant data
    const [user, tenant, pendingBookings] = await Promise.all([
        getCurrentUser(),
        getCurrentTenant(),
        getPendingBookingsCount(),
    ]);

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar user={user} tenant={tenant} pendingBookings={pendingBookings} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
