import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";

export async function getPayments() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return [];

    const { data: payments } = await supabase
        .from("payment_transactions")
        .select(`
            id,
            external_id,
            amount,
            status,
            payment_method,
            paid_at,
            created_at,
            currency
        `)
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });

    return payments || [];
}

export async function getWalletBalance() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) return { available: 0, pending: 0, withdrawn: 0 };

    // Calculate balances from transactions
    // This is a simplified calculation. Real-world would use a balance table or ledger.

    // Available: Completed incoming payments
    const { data: completed } = await supabase
        .from("payment_transactions")
        .select("amount")
        .eq("tenant_id", tenant.id)
        .eq("status", "completed");

    const available = completed?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    // Pending: Pending incoming payments
    const { data: pending } = await supabase
        .from("payment_transactions")
        .select("amount")
        .eq("tenant_id", tenant.id)
        .eq("status", "pending");

    const pendingAmount = pending?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    return {
        available: available,
        pending: pendingAmount,
        withdrawn: 0 // No withdrawals table yet
    };
}
