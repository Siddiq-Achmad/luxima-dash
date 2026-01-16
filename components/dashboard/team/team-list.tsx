"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, MoreHorizontal, Trash2, Users, UserCheck, UserMinus, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeMember } from "@/lib/actions/team";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { TenantMember } from "@/lib/types";

interface ExtendedTenantMember extends TenantMember {
    roles?: {
        name: string;
        role: string;
    };
}

type TeamListProps = {
    members: ExtendedTenantMember[];
};

export function TeamList({ members }: TeamListProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleRemove(id: string) {
        const res = await removeMember(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Member removed");
            router.refresh();
        }
        setDeletingId(null);
    }

    // Stats Logic
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active' || m.status === 'accepted').length;

    // Mocking "On Leave" as I don't have that data, set to 0 or random for visual if desired, but 0 is safer.
    const onLeave = 0;

    // New members in last 30 days
    const newMembers = members.filter(m => {
        const joinedDate = new Date(m.joined_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinedDate > thirtyDaysAgo;
    }).length;

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(members.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = members.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                        <div className="text-sm text-muted-foreground">Total Members</div>
                    </div>
                </Card>
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{activeMembers}</div>
                        <div className="text-sm text-muted-foreground">Active Now</div>
                    </div>
                </Card>
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <UserMinus className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{onLeave}</div>
                        <div className="text-sm text-muted-foreground">On Leave</div>
                    </div>
                </Card>
                <Card className="flex items-center p-4 gap-8 shadow-sm border-none flex-row">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{newMembers}</div>
                        <div className="text-sm text-muted-foreground">New Joiners</div>
                    </div>
                </Card>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm  overflow-hidden p-4">
                <Table>
                    <TableHeader className="bg-neutral-50/50 dark:bg-muted/20">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            <TableHead className="py-4 font-semibold w-[300px]">Member</TableHead>
                            <TableHead className="py-4 font-semibold">Role</TableHead>
                            <TableHead className="py-4 font-semibold">Status</TableHead>
                            <TableHead className="py-4 font-semibold">Joined Date</TableHead>
                            <TableHead className="py-4 font-semibold text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedMembers.map((member) => (
                            <TableRow key={member.id} className="hover:bg-neutral-50/50 dark:hover:bg-muted/20 border-gray-100 dark:border-border">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage src={member.profiles?.avatar_url || undefined} />
                                            <AvatarFallback>
                                                {member.profiles?.full_name
                                                    ?.split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .substring(0, 2) || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{member.profiles?.full_name || "Unknown"}</div>
                                            <div className="text-xs text-muted-foreground">{member.profiles?.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-sm capitalize">{member.roles?.name || member.roles?.role || "Member"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        variant="outline"
                                        className={`capitalize border-0 ${member.status === 'active' || member.status === 'accepted' ? "bg-green-100 text-green-700" :
                                            "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {member.status || "Unknown"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-sm text-muted-foreground">
                                    {format(new Date(member.joined_at), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                            <AlertDialog open={deletingId === member.id} onOpenChange={(open) => setDeletingId(open ? member.id : null)}>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Remove Member
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will remove the member from your organization. They will lose access immediately.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRemove(member.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Remove
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
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
