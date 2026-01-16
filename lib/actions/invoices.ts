"use server";

import { DUMMY_INVOICES } from "@/lib/dummy-data";
import { Invoice } from "@/lib/types";

// Mock actions for Invoices
export async function getInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_INVOICES;
}

export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_INVOICES.find(i => i.id === id);
}
