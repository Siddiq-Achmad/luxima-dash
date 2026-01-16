"use client";

import { useState } from "react";
import { Customer } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Trash, Eye, Pencil, ChevronLeft, ChevronRight, Users, UserCheck, UserPlus, UserX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/lib/actions/customer";
import { format } from "date-fns";
import { toast } from "sonner";
import { CustomerDialog } from "./customer-dialog";

interface CustomerListProps {
    initialData: Customer[];
}

export function CustomerList({ initialData }: CustomerListProps) {
    const [filter, setFilter] = useState("");
    const [data, setData] = useState<Customer[]>(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    const filteredData = data.filter((customer) =>
        customer.full_name.toLowerCase().includes(filter.toLowerCase()) ||
        customer.email.toLowerCase().includes(filter.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Stats Calculations
    const totalCustomers = data.length;
    const activeCustomers = data.filter(c => c.status === 'active').length;
    const leads = data.filter(c => c.status === 'lead').length;
    const inactiveCustomers = data.filter(c => c.status === 'inactive').length;

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            const result = await deleteCustomer(id);
            if (result.success) {
                setData(data.filter((c) => c.id !== id));
                toast.success("Customer deleted");
                router.refresh();
            } else {
                toast.error("Failed to delete customer");
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                        <div className="text-sm text-muted-foreground">Total Customers</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{activeCustomers}</div>
                        <div className="text-sm text-muted-foreground">Active Customers</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{leads}</div>
                        <div className="text-sm text-muted-foreground">Leads</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <UserX className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{inactiveCustomers}</div>
                        <div className="text-sm text-muted-foreground">Inactive</div>
                    </div>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customers..."
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                        </div>
                        <CustomerDialog
                            onSuccess={(newCustomer) => {
                                // Optimistic update or refresh
                                setData([...data, newCustomer]);
                                router.refresh();
                            }}
                        />
                    </div>
                </CardHeader>
                <CardContent>

                    <div className="rounded-md border p-4 mb-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Last Contacted</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedData.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={customer.avatar_url} />
                                                        <AvatarFallback>{customer.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{customer.full_name}</span>
                                                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    customer.status === "active" ? "default" :
                                                        customer.status === "lead" ? "secondary" : "outline"
                                                }>
                                                    {customer.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{customer.source || "-"}</TableCell>
                                            <TableCell>
                                                {customer.last_contacted_at ? format(new Date(customer.last_contacted_at), 'PPP') : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/customers/${customer.id}`} >
                                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <CustomerDialog customer={customer} onSuccess={(updated) => {
                                                            setData(data.map(c => c.id === updated.id ? updated : c));
                                                        }} trigger={
                                                            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </div>
                                                        } />
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-destructive">
                                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
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
                </CardContent>
            </Card>
        </div>
    );
}
