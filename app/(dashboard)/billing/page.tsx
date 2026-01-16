import { DUMMY_INVOICES } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Download } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
                    <p className="text-muted-foreground">Manage your invoices and payment history.</p>
                </div>
                <Button>
                    <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the Pro Plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(150000)}<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <p className="text-sm text-muted-foreground mt-2">Next billing date: August 1, 2024</p>
                        <Button className="mt-4 w-full">Manage Subscription</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Your default payment method.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/25</p>
                            </div>
                        </div>
                        <Button variant="ghost">Edit</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>A history of your recent invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_INVOICES.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                                    <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
