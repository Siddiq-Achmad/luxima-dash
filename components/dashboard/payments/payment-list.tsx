"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CreditCard, Wallet, AlertCircle, MoreVertical, ChevronLeft, ChevronRight, Search } from "lucide-react";
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
import { format } from "date-fns";
import { Payment } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentListProps {
    initialStats: {
        transactions: Payment[];
    };
}

export function PaymentList({ initialStats }: PaymentListProps) {
    const [transactions, setTransactions] = useState<Payment[]>(initialStats.transactions);
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    // Stats Logic
    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(t => t.status === 'completed' || t.status === 'succeeded');
    const pendingTransactions = transactions.filter(t => t.status === 'pending');
    const failedTransactions = transactions.filter(t => t.status === 'failed');

    const totalRevenue = completedTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = pendingTransactions.reduce((acc, curr) => acc + curr.amount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
    };

    // Filter Logic
    const filteredTransactions = transactions.filter((transaction) =>
        (transaction.description?.toLowerCase().includes(filter.toLowerCase()) || "") ||
        (transaction.payment_method?.toLowerCase().includes(filter.toLowerCase()) || "")
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none  ">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none  ">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{totalTransactions}</div>
                        <div className="text-sm text-muted-foreground">Total Transactions</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none  ">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <ArrowUpRight className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
                        <div className="text-sm text-muted-foreground">Pending Output</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none  ">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{failedTransactions.length}</div>
                        <div className="text-sm text-muted-foreground">Failed Transactions</div>
                    </div>
                </Card>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search transactions..."
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
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4  overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-muted/20">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            <TableHead className="py-4 font-semibold w-[300px]">Description</TableHead>
                            <TableHead className="py-4 font-semibold">Date</TableHead>
                            <TableHead className="py-4 font-semibold">Method</TableHead>
                            <TableHead className="py-4 font-semibold">Amount</TableHead>
                            <TableHead className="py-4 font-semibold">Status</TableHead>
                            <TableHead className="py-4 font-semibold text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTransactions.map((transaction: Payment) => (
                                <TableRow key={transaction.id} className="hover:bg-gray-50/50 dark:hover:bg-muted/20 border-gray-100 dark:border-border">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                    <Link href={`/payments/${transaction.id}`} className="hover:underline">
                                                        {transaction.description || "Transaction"}
                                                    </Link>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{transaction.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{format(new Date(transaction.created_at), "MMM d, yyyy")}</span>
                                            <span className="text-xs text-muted-foreground">{format(new Date(transaction.created_at), "HH:mm")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-muted-foreground capitalize">
                                        {transaction.payment_method || "Unknown"}
                                    </TableCell>
                                    <TableCell className="py-4 font-medium">
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize border-0 ${transaction.status === "completed" || transaction.status === "succeeded" ? "bg-green-100 text-green-700" :
                                                transaction.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {transaction.status}
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
                                                    <Link href={`/payments/${transaction.id}`}>View Details</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
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
