"use server";

import { DUMMY_CUSTOMERS } from "@/lib/dummy-data";
import { Customer } from "@/lib/types";
import { revalidatePath } from "next/cache";

// Mock database (in-memory for demo, but immutable in server actions normally)
let customers = [...DUMMY_CUSTOMERS];

export async function getCustomers(): Promise<Customer[]> {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return customers;
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return customers.find((c) => c.id === id);
}

export async function createCustomer(data: Omit<Customer, "id" | "created_at">) {
    const newCustomer: Customer = {
        ...data,
        id: `cust-${Date.now()}`,
        created_at: new Date().toISOString(),
    };
    customers.push(newCustomer);
    revalidatePath("/customers");
    return { success: true, data: newCustomer };
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
    const index = customers.findIndex((c) => c.id === id);
    if (index !== -1) {
        customers[index] = { ...customers[index], ...data };
        revalidatePath("/customers");
        return { success: true, data: customers[index] };
    }
    return { success: false, error: "Customer not found" };
}

export async function deleteCustomer(id: string) {
    customers = customers.filter((c) => c.id !== id);
    revalidatePath("/customers");
    return { success: true };
}
