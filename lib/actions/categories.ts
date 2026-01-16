"use server";

import { Category } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data as Category[];
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching category:", error);
        return undefined;
    }

    return data as Category;
}

export async function createCategory(data: Partial<Category>): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // Auto-generate slug if not provided? Usually handled by frontend or logic.
    // Assuming simple insert here.
    const { error } = await supabase
        .from("categories")
        .insert([{
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            status: data.status || 'active',
            sort_order: data.sort_order || 0
            // created_at is automatic default
        }]);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/vendors/categories");
    return { success: true };
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .update({
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            status: data.status,
            sort_order: data.sort_order
        })
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/vendors/categories");
    return { success: true };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/vendors/categories");
    return { success: true };
}
