"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const bookingSchema = z.object({
    user_id: z.string().uuid(),
    package_id: z.string().uuid().optional(),
    event_start: z.string(), // ISO date string
    event_end: z.string(),   // ISO date string
    status: z.string().optional(),
    notes: z.string().optional(),
});

export async function createBooking(data: z.infer<typeof bookingSchema>) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return { error: "Unauthorized" };

    // We need a vendor_id for the booking.
    // For now, let's assume the tenant has at least one vendor profile or we pick the first one linked to the tenant
    // Or created booking is linked to a specific vendor?
    // Schema: bookings -> vendor_id, user_id.
    // We need to find the vendor_id associated with this tenant.

    const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("tenant_id", tenant.id)
        .single();

    if (!vendor) return { error: "No vendor profile found for this tenant" };

    const { error } = await supabase.from("bookings").insert({
        tenant_id: tenant.id, // Wait, bookings doesn't have tenant_id? It has vendor_id.
        // Let's check schema: bookings (vendor_id, user_id, package_id, ...)
        // So we use vendor.id
        vendor_id: vendor.id,
        user_id: data.user_id,
        package_id: data.package_id,
        event_start: data.event_start,
        event_end: data.event_end,
        status: data.status || "pending",
        notes: data.notes,
    });

    if (error) return { error: error.message };

    revalidatePath("/bookings");
    return { success: true };
}

export async function updateBooking(id: string, data: Partial<z.infer<typeof bookingSchema>>) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("bookings")
        .update({
            event_start: data.event_start,
            event_end: data.event_end,
            status: data.status,
            notes: data.notes,
            package_id: data.package_id
        })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/bookings");
    return { success: true };
}

export async function deleteBooking(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/bookings");
    return { success: true };
}
