"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Post, VendorImage, VendorPackage } from "@/lib/types";

// --- Posts ---
export async function createPost(data: Partial<Post>) {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath("/posts");
    return { success: true };
}

export async function updatePost(id: string, data: Partial<Post>) {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").update(data).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/posts");
    return { success: true };
}

export async function getPosts() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
    return data as Post[];
}

export async function getPostById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error) return null;
    return data as Post;
}

export async function getPostBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single();
    if (error) return null;
    return data as Post;
}

export async function deletePost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
        console.error("Error deleting post:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/posts");
    return { success: true };
}

// --- Portfolio ---
export async function createPortfolioItem(data: Partial<VendorImage>) {
    const supabase = await createClient();
    const { error } = await supabase.from("vendor_images").insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath("/portfolio");
    return { success: true };
}

export async function updatePortfolioItem(id: string, data: Partial<VendorImage>) {
    const supabase = await createClient();
    const { error } = await supabase.from("vendor_images").update(data).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/portfolio");
    return { success: true };
}

export async function getPortfolio() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendor_images").select("*").order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching portfolio:", error);
        return [];
    }
    return data as VendorImage[];
}

export async function getPortfolioById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendor_images").select("*").eq("id", id).single();
    if (error) return null;
    return data as VendorImage;
}

export async function deletePortfolioItem(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("vendor_images").delete().eq("id", id);
    if (error) {
        console.error("Error deleting portfolio item:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/portfolio");
    return { success: true };
}

// --- Packages ---
export async function createPackage(data: Partial<VendorPackage>) {
    const supabase = await createClient();
    const { error } = await supabase.from("vendor_packages").insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath("/packages");
    return { success: true };
}

export async function updatePackage(id: string, data: Partial<VendorPackage>) {
    const supabase = await createClient();
    const { error } = await supabase.from("vendor_packages").update(data).eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/packages");
    return { success: true };
}

export async function getPackages() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendor_packages").select("*"); // Add ordering if needed
    if (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
    return data as VendorPackage[];
}

export async function getPackageById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendor_packages").select("*").eq("id", id).single();
    if (error) return null;
    return data as VendorPackage;
}

export async function deletePackage(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("vendor_packages").delete().eq("id", id);
    if (error) {
        console.error("Error deleting package:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/packages");
    return { success: true };
}
