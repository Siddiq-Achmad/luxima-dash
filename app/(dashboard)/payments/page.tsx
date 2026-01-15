import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { getPayments, getWalletBalance } from "@/lib/data/payments";
import { format } from "date-fns";

export default async function PaymentsPage() {
    const payments = await getPayments();
    const walletBalance = await getWalletBalance();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
                <p className="text-muted-foreground">
                    Track incoming and outgoing payments
                </p>
            </div>

            {/* Wallet Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Available Balance
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(walletBalance.available)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(walletBalance.pending)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Withdrawn
                        </CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(walletBalance.withdrawn)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Recent payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {payments.map((payment: any) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${"bg-green-100 text-green-600"
                                            // For now we assume all payments are incoming 
                                            }`}
                                    >
                                        <ArrowDownLeft className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{payment.external_id || "Transaction"}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {payment.payment_method} · {format(new Date(payment.created_at), "MMM d, HH:mm")}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div
                                            className="font-medium text-green-600"
                                        >
                                            + {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(payment.amount)}
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            payment.status === "completed" ? "default" : "secondary"
                                        }
                                    >
                                        {payment.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {payments.length === 0 && (
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
