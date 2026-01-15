import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Internal service domains
const AUTH_DOMAIN =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://auth.luxima.id";

const AUTH_COOKIE_DOMAIN =
    process.env.NODE_ENV === "development" ? ".localhost" : ".luxima.id";

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                name: "sb-luxima-auth-token",
                domain: AUTH_COOKIE_DOMAIN,
                secure: process.env.NODE_ENV !== "development",
                path: "/",
                sameSite: "lax",
            },
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, {
                            ...options,
                            domain: AUTH_COOKIE_DOMAIN,
                        })
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Public routes that don't require auth
    const publicPaths = ["/", "/api/health"];
    const isPublic = publicPaths.some(
        (path) => pathname === path || pathname.startsWith("/api/public")
    );

    // Redirect to auth if not authenticated
    if (!user && !isPublic) {
        const redirectUrl = new URL(`${AUTH_DOMAIN}/`);
        redirectUrl.searchParams.set("redirect", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // If authenticated, verify tenant tier access
    // if (user) {
    //     // Get user's tenant membership
    //     const { data: membership } = await supabase
    //         .from("tenant_members")
    //         .select("id, role_tier, tenant_id, status")
    //         .eq("profile_id", user.id)
    //         .eq("status", "active")
    //         .single();

    //     if (!membership) {
    //         // User has no tenant membership - redirect to main site
    //         return NextResponse.redirect(
    //             new URL("https://app.luxima.id/join-organization", request.url)
    //         );
    //     }

    //     // Must be tenant tier or higher
    //     if (membership.role_tier !== "system" && membership.role_tier !== "tenant") {
    //         return NextResponse.redirect(
    //             new URL(`${AUTH_DOMAIN}/unauthorized?reason=tier`, request.url)
    //         );
    //     }

    //     // Set tenant context headers
    //     response.headers.set("x-tenant-id", membership.tenant_id);
    //     response.headers.set("x-user-role-tier", membership.role_tier);
    // }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
