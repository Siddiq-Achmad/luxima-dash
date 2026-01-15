import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CreditCard, Wallet } from "lucide-react";
import { getPaymentStats } from "@/lib/data/payments";
import { format } from "date-fns";
import { Payment } from "@/lib/types";

export default async function PaymentsPage() {
    const stats = await getPaymentStats();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(stats.balance)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Available for withdrawal
                        </p>
                        <div className="mt-4">
                            <Button size="sm">Withdraw Funds</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Output</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(stats.pending)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Processing transactions
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        Recent payment transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.transactions.map((transaction: Payment) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{transaction.description || "Transaction"}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(transaction.created_at), "MMM d, yyyy HH:mm")}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                                        {transaction.status}
                                    </Badge>
                                    <div className={`font-medium ${transaction.status === 'completed' ? 'text-green-600' : ''}`}>
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(transaction.amount)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats.transactions.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No transactions found.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
