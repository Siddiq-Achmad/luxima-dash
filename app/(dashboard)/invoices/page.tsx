import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getInvoices } from "@/lib/data/invoices";
import { InvoiceList } from "@/components/dashboard/invoices/invoice-list";

export default async function InvoicesPage() {
    const invoices = await getInvoices();

    return (
        <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground mt-1">Manage your {invoices.length} invoices</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
            </div>

            <InvoiceList initialInvoices={invoices} />
        </div>
    );
}
