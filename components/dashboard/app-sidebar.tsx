"use client";

import {
    LayoutDashboard,
    Calendar,
    FileText,
    CreditCard,
    Users,
    Settings,
    Building2,
    BarChart3,
    Bell,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/auth/actions";
import type { UserData, TenantData } from "@/lib/auth/get-user";

type NavItem = {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
};

// Main navigation items
const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Bookings",
        url: "/bookings",
        icon: Calendar,
    },
    {
        title: "Invoices",
        url: "/invoices",
        icon: FileText,
    },
    {
        title: "Payments",
        url: "/payments",
        icon: CreditCard,
    },
];

// Management items
const managementItems: NavItem[] = [
    {
        title: "Team",
        url: "/team",
        icon: Users,
    },
    {
        title: "Organization",
        url: "/organization",
        icon: Building2,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

type AppSidebarProps = {
    user: UserData | null;
    tenant: TenantData | null;
    pendingBookings?: number;
};

export function AppSidebar({ user, tenant, pendingBookings = 0 }: AppSidebarProps) {
    const pathname = usePathname();

    // Add booking badge dynamically
    const navItems = mainNavItems.map((item) => {
        if (item.url === "/bookings" && pendingBookings > 0) {
            return { ...item, badge: pendingBookings.toString() };
        }
        return item;
    });

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-3">
                    {tenant?.logoUrl ? (
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={tenant.logoUrl} alt={tenant.name} />
                            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                                <Building2 className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Building2 className="h-4 w-4" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {tenant?.name || "Luxima Dash"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {tenant?.subdomain ? `${tenant.subdomain}.awedz.id` : "Tenant Portal"}
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto h-5 px-1.5 text-xs"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={user?.avatarUrl || undefined} />
                                        <AvatarFallback>{user?.initials || "??"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-1 flex-col text-left text-sm">
                                        <span className="font-medium">
                                            {user?.fullName || "Guest"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {user?.email || "Not signed in"}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/notifications">
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notifications
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
