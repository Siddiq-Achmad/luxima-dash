import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { getPaymentStats } from "@/lib/data/payments";
import { PaymentList } from "@/components/dashboard/payments/payment-list";

export default async function PaymentsPage() {
    const stats = await getPaymentStats();

    return (
        <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground mt-1">Manage your {stats.transactions.length} transactions</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <Button variant="outline">
                        Export
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Wallet className="mr-2 h-4 w-4" /> Withdraw Funds
                    </Button>
                </div>
            </div>

            <PaymentList initialStats={stats} />
        </div>
    );
}
