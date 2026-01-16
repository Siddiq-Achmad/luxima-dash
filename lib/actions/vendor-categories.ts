"use server";

import { VendorCategory } from "@/lib/types";
import { DUMMY_VENDOR_CATEGORIES, DUMMY_CATEGORIES } from "@/lib/dummy-data";

// Mock Data (Mutable for this session)
let VENDOR_CATEGORIES_DB = [...DUMMY_VENDOR_CATEGORIES];

export async function getVendorCategories(vendorId: string): Promise<VendorCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Join with Categories to get details
    return VENDOR_CATEGORIES_DB.filter(vc => vc.vendor_id === vendorId).map(vc => ({
        ...vc,
        categories: DUMMY_CATEGORIES.find(c => c.id === vc.category_id)
    }));
}

export async function updateVendorCategories(vendorId: string, categoryIds: string[]): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Remove existing
    VENDOR_CATEGORIES_DB = VENDOR_CATEGORIES_DB.filter(vc => vc.vendor_id !== vendorId);

    // Add new
    const newAssignments = categoryIds.map(catId => ({
        vendor_id: vendorId,
        category_id: catId,
        categories: DUMMY_CATEGORIES.find(c => c.id === catId)
    }));

    VENDOR_CATEGORIES_DB = [...VENDOR_CATEGORIES_DB, ...newAssignments];

    return { success: true };
}
