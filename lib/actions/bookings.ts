"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { bookingSchema } from "@/lib/schemas";
import { Booking } from "@/lib/types";

export async function createBooking(data: z.infer<typeof bookingSchema>) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return { error: "Unauthorized" };

    const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("tenant_id", tenant.id)
        .single();

    if (!vendor) return { error: "No vendor profile found for this tenant" };

    const { error } = await supabase.from("bookings").insert({
        tenant_id: tenant.id,
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

export async function getBookingById(id: string) {
    const supabase = await createClient();

    if (id.startsWith('dummy-')) {
        const { DUMMY_BOOKINGS } = await import('@/lib/dummy-data');
        return DUMMY_BOOKINGS.find(b => b.id === id);
    }

    const { data, error } = await supabase
        .from("bookings")
        .select(`
           *,
           profiles:user_id (*),
           vendor_packages:package_id (*),
           vendors:vendor_id (*)
       `)
        .eq("id", id)
        .single();

    if (error) return null;
    return data as Booking;
}
