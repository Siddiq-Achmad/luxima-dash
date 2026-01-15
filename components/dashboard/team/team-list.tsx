"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";
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

type TeamListProps = {
    members: any[];
};

function getRoleColor(role: string) {
    switch (role) {
        case "Owner":
        case "owner":
            return "bg-purple-100 text-purple-800";
        case "Admin":
        case "tenant_admin":
            return "bg-blue-100 text-blue-800";
        case "Staff":
        case "staff":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                    {members.length} members in your organization
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{member.profiles?.full_name || "Unknown"}</span>
                                        {member.status === "pending" && (
                                            <Badge variant="outline" className="text-xs">
                                                Pending
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        {member.profiles?.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(
                                            member.roles?.role || "member"
                                        )}`}
                                    >
                                        {member.roles?.name || member.roles?.role}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Joined {format(new Date(member.joined_at), "MMM yyyy")}
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
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
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No team members found.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
