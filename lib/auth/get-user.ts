import { createClient } from "@/lib/supabase/server";

export type UserData = {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    initials: string;
};

export type TenantData = {
    id: string;
    name: string;
    subdomain: string | null;
    logoUrl: string | null;
};

export async function getCurrentUser(): Promise<UserData | null> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

    const fullName = profile?.full_name || user.email?.split("@")[0] || "User";
    const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return {
        id: user.id,
        email: user.email || "",
        fullName,
        avatarUrl: profile?.avatar_url || null,
        initials,
    };
}

export async function getCurrentTenant(): Promise<TenantData | null> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user's tenant membership
    const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("profile_id", user.id)
        .eq("status", "active")
        .single();

    if (!membership) return null;

    // Get tenant data
    const { data: tenant } = await supabase
        .from("tenants")
        .select("id, name, subdomain, logo_url")
        .eq("id", membership.tenant_id)
        .single();

    if (!tenant) return null;

    return {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        logoUrl: tenant.logo_url,
    };
}

export async function getPendingBookingsCount(): Promise<number> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return 0;

    // Get user's tenant
    const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("profile_id", user.id)
        .eq("status", "active")
        .single();

    if (!membership) return 0;

    // Count pending bookings
    const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", membership.tenant_id)
        .eq("status", "pending");

    return count || 0;
}
