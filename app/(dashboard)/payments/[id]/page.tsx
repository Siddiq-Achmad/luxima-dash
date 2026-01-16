import { getPaymentById } from "@/lib/actions/payments";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { CreditCard, CheckCircle2, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({ params }: PageProps) {
    const { id } = await params;
    const payment = await getPaymentById(id);

    if (!payment) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Payment Details</h1>
                <p className="text-muted-foreground text-sm font-mono mt-1">ID: {payment.id}</p>
            </div>

            <Card className="border-t-4 border-t-primary">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
                        {payment.status === "completed" ? (
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        ) : (
                            <Clock className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>
                    <CardTitle className="text-3xl font-bold text-primary">
                        {formatCurrency(payment.amount)}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2 mt-2">
                        Status:
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status.toUpperCase()}
                        </Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-muted-foreground block">Payment Date</span>
                            <span className="font-medium">{format(new Date(payment.created_at), 'PPP p')}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground block">Method</span>
                            <span className="font-medium flex items-center gap-1">
                                <CreditCard className="h-4 w-4" /> {payment.method_id || "Unknown"}
                            </span>
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium text-sm">Related Invoice</p>
                                <p className="text-xs text-muted-foreground">{payment.invoice_id || "N/A"}</p>
                            </div>
                        </div>
                        {payment.invoice_id && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/invoices/${payment.invoice_id}`}>
                                    View Invoice
                                </Link>
                            </Button>
                        )}
                    </div>

                    {payment.description && (
                        <div>
                            <h3 className="font-medium text-sm mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground">{payment.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
