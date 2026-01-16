"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { orgSchema } from "@/lib/schemas";

export async function updateOrganization(data: z.infer<typeof orgSchema>) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    //jika tenant tidak ada, maka buatkan tenant baru, jika sudah ada maka update tenant
    if (!tenant) {
        const { data: newTenant, error: createError } = await supabase
            .from("tenants")
            .insert({
                name: data.name,
                billing_email: data.billing_email,
                description: data.description,
            })
            .select()
            .single();

        if (createError) return { error: createError.message };

        // Tambahkan user ke tenant baru
        const { error: memberError } = await supabase
            .from("tenant_members")
            .insert({
                tenant_id: newTenant.id,
                user_id: (await supabase.auth.getUser()).data.user?.id,
                role: "owner",
            });

        if (memberError) return { error: memberError.message };

        revalidatePath("/organization");
        revalidatePath("/settings");
        return { success: true };
    }

    const { error } = await supabase
        .from("tenants")
        .update({
            name: data.name,
            billing_email: data.billing_email,
            description: data.description,
            // updated_at: new Date().toISOString() // Should be handled by DB trigger
        })
        .eq("id", tenant.id);

    if (error) return { error: error.message };

    revalidatePath("/organization");
    revalidatePath("/settings");
    return { success: true };
}
