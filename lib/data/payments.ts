import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/auth/get-user";
import { DUMMY_PAYMENTS } from "@/lib/dummy-data";
import { Payment } from "@/lib/types";

export async function getPaymentStats() {
    const supabase = await createClient();
    const tenant = await getCurrentTenant();

    if (!tenant) {
        return {
            balance: 50000000,
            pending: 1500000,
            transactions: DUMMY_PAYMENTS
        };
    }

    // 1. Transactions
    const { data: transactions } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });

    // 2. Calculate Balance (Completed)
    const balance = transactions
        ?.filter(t => t.status === "completed")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // 3. Pending
    const pending = transactions
        ?.filter(t => t.status === "pending")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    if (!transactions || transactions.length === 0) {
        return {
            balance: 50000000,
            pending: 1500000,
            transactions: DUMMY_PAYMENTS
        };
    }

    // Map to simplified Payment type if needed or keep raw
    // DUMMY_PAYMENTS uses simplified type.
    // Let's ensure consistency. `payment_transactions` has `description`? No, maybe `external_id` or `payment_method`.
    // I need to map it.

    const mappedTransactions: Payment[] = transactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        status: t.status,
        created_at: t.created_at!,
        description: t.description || t.payment_method || "Transaction",
        payment_method: t.payment_method,
        tenant_id: t.tenant_id
    }));

    return {
        balance,
        pending,
        transactions: mappedTransactions
    };
}
