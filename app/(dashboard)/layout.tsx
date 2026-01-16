import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, getCurrentTenant, getPendingBookingsCount } from "@/lib/auth/get-user";
import { Search } from "@/components/dashboard/header/search";
import { ModeToggle } from "@/components/dashboard/header/mode-toggle";
import { Notifications } from "@/components/dashboard/header/notifications";
import { UserNav } from "@/components/dashboard/header/user-nav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const cookieState = cookieStore.get("sidebar_state");
    const defaultOpen = cookieState ? cookieState.value === "true" : true;

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
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1 className="text-lg font-semibold">{tenant ? tenant.name : "Dashboard"}</h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden md:block">
                            <Search />
                        </div>
                        <Notifications />
                        <ModeToggle />
                        <UserNav user={user} />
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
