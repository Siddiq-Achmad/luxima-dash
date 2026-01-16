"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { inviteMember } from "@/lib/actions/team";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function TeamDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const data = {
            email: formData.get("email") as string,
            role: formData.get("role") as string,
        };

        const result = await inviteMember(data);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Member invited successfully");
            setOpen(false);
            router.refresh();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                        Invite a new member to your organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                            <Label htmlFor="email" className="text-left sm:text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                className="col-span-1 sm:col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                            <Label htmlFor="role" className="text-left sm:text-right">
                                Role
                            </Label>
                            <Select name="role" required defaultValue="staff">
                                <SelectTrigger className="col-span-1 sm:col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tenant_admin">Admin</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Inviting..." : "Send Invitation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
