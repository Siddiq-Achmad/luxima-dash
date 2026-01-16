import { getInvoiceById } from "@/lib/actions/invoices";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { FileText, Calendar, CreditCard, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Invoice {invoice.invoice_number}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <span className="text-sm">{invoice.id}</span>
                        <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
                            {invoice.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">INVOICE</span>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-primary">{formatCurrency(invoice.amount)}</h2>
                            <span className="text-sm text-muted-foreground">Total Amount</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                            <User className="h-4 w-4" /> Billed To
                        </h3>
                        {invoice.profiles ? (
                            <div className="text-sm space-y-1">
                                <p className="font-medium text-base">{invoice.profiles.full_name}</p>
                                <p className="text-muted-foreground">{invoice.profiles.email}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Customer information unavailable</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Issued Date
                            </span>
                            <span className="font-medium">{format(new Date(invoice.created_at), 'PPP')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Due Date
                            </span>
                            <span className="font-medium">{format(new Date(invoice.due_date), 'PPP')}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-6">
                    <div className="w-full">
                        <h3 className="font-medium mb-2">Item Details</h3>
                        <div className="flex justify-between py-2 border-b text-sm">
                            <span>subscription_plan</span>
                            <span>{invoice.subscriptions?.subscription_plans?.name || "Service Subscription"}</span>
                        </div>
                        <div className="flex justify-between py-4 font-bold">
                            <span>Total Due</span>
                            <span>{formatCurrency(invoice.amount)}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
