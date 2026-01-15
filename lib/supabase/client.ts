import { createBrowserClient } from "@supabase/ssr";

// Shared cookie configuration for cross-domain auth
const AUTH_COOKIE_DOMAIN =
    process.env.NODE_ENV === "development" ? ".localhost" : ".luxima.id";

export function createClient() {
    return createBrowserClient(
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
        }
    );
}
