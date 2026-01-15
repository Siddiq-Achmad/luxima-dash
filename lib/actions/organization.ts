"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const orgSchema = z.object({
    name: z.string().min(2),
    billing_email: z.string().email().optional(),
    description: z.string().optional(),
});

export async function updateOrganization(data: z.infer<typeof orgSchema>) {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("tenants")
        .update({
            name: data.name,
            billing_email: data.billing_email,
            description: data.description,
        })
        .eq("id", tenant.id);

    if (error) return { error: error.message };

    revalidatePath("/organization");
    revalidatePath("/settings");
    return { success: true };
}
