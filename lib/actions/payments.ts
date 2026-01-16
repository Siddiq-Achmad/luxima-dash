"use server";

import { DUMMY_PAYMENTS } from "@/lib/dummy-data";
import { Payment } from "@/lib/types";

// Mock actions for Payments
export async function getPayments(): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_PAYMENTS;
}

export async function getPaymentById(id: string): Promise<Payment | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_PAYMENTS.find(p => p.id === id);
}
