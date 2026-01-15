import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Shared cookie configuration for cross-domain auth
const AUTH_COOKIE_DOMAIN =
    process.env.NODE_ENV === "development" ? ".localhost" : ".luxima.id";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
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
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, {
                                ...options,
                                domain: AUTH_COOKIE_DOMAIN,
                                secure: process.env.NODE_ENV !== "development",
                                path: "/",
                                sameSite: "lax",
                            })
                        );
                    } catch {
                        // Ignore silently when called from server components
                    }
                },
            },
        }
    );
}
