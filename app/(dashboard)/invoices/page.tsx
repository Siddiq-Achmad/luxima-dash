import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Plus } from "lucide-react";
import { Invoice } from "@/lib/types";
import { getInvoices } from "@/lib/data/invoices";
import { format } from "date-fns";

function getStatusVariant(status: string) {
    switch (status) {
        case "paid":
            return "default";
        case "pending":
            return "secondary";
        case "overdue":
            return "destructive";
        default:
            return "outline";
    }
}

export default async function InvoicesPage() {
    const invoices = await getInvoices();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
                    <p className="text-muted-foreground">
                        Manage invoices and track payments
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Invoices</CardTitle>
                    <CardDescription>
                        A list of all invoices including their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {invoices.map((invoice: Invoice) => (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{invoice.invoice_number}</span>
                                            <Badge variant={getStatusVariant(invoice.status)}>
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {invoice.subscriptions?.subscription_plans?.name || "Subscription"} · Due {format(new Date(invoice.due_date), "MMM d, yyyy")}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-medium">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(invoice.amount)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Issued {format(new Date(invoice.created_at), "MMM d, yyyy")}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {invoices.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No invoices found.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
