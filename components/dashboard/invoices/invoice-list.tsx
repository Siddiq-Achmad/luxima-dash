"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, CheckCircle2, AlertCircle, MoreVertical, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Invoice } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface InvoiceListProps {
    initialInvoices: Invoice[];
}

export function InvoiceList({ initialInvoices }: InvoiceListProps) {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    // Stats Logic
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const pendingInvoices = invoices.filter(i => i.status === 'pending');
    const overdueInvoices = invoices.filter(i => i.status === 'overdue');

    const paidAmount = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = pendingInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const overdueAmount = overdueInvoices.reduce((acc, curr) => acc + curr.amount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
    };

    // Filter Logic
    const filteredInvoices = invoices.filter((invoice) =>
        invoice.invoice_number.toLowerCase().includes(filter.toLowerCase()) ||
        invoice.profiles?.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
        invoice.profiles?.email?.toLowerCase().includes(filter.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{totalInvoices}</div>
                        <div className="text-sm text-muted-foreground">Total Invoices</div>
                    </div>
                </Card>
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{formatCurrency(paidAmount)}</div>
                        <div className="text-sm text-muted-foreground">Paid Amount</div>
                    </div>
                </Card>
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <div className="h-6 w-6 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">
                            <span className="mb-[1px]">↻</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
                        <div className="text-sm text-muted-foreground">Pending Amount</div>
                    </div>
                </Card>
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{formatCurrency(overdueAmount)}</div>
                        <div className="text-sm text-muted-foreground">Overdue Amount</div>
                    </div>
                </Card>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search invoices..."
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-8 w-[300px]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex-row overflow-hidden p-4">
                <Table className="w-full">
                    <TableHeader className="bg-gray-50/50 dark:bg-muted/20">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            <TableHead className="py-4 font-semibold w-[200px]">Invoice ID</TableHead>
                            <TableHead className="py-4 font-semibold">Customer</TableHead>
                            <TableHead className="py-4 font-semibold">Plan</TableHead>
                            <TableHead className="py-4 font-semibold">Date</TableHead>
                            <TableHead className="py-4 font-semibold">Amount</TableHead>
                            <TableHead className="py-4 font-semibold">Status</TableHead>
                            <TableHead className="py-4 font-semibold text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedInvoices.map((invoice: Invoice) => (
                                <TableRow key={invoice.id} className="hover:bg-gray-50/50 dark:hover:bg-muted/20 border-gray-100 dark:border-border">
                                    <TableCell className="py-4 font-medium">
                                        <Link href={`/invoices/${invoice.id}`} className="flex items-center gap-2 hover:underline">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {invoice.invoice_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                                {invoice.profiles?.full_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{invoice.profiles?.full_name || "Unknown"}</div>
                                                <div className="text-xs text-muted-foreground">{invoice.profiles?.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-muted-foreground">
                                        {invoice.subscriptions?.subscription_plans?.name || "Single Charge"}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{format(new Date(invoice.created_at), "MMM d, yyyy")}</span>
                                            <span className="text-xs text-muted-foreground">Due {format(new Date(invoice.due_date), "MMM d")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 font-medium">
                                        {formatCurrency(invoice.amount)}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize border-0 ${invoice.status === "paid" ? "bg-green-100 text-green-700" :
                                                invoice.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/invoices/${invoice.id}`}>View Invoice</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                                {invoice.status !== 'paid' && (
                                                    <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
