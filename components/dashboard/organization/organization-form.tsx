"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateOrganization } from "@/lib/actions/organization";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type OrgFormProps = {
    initialData: any;
};

export function OrganizationForm({ initialData }: OrgFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            billing_email: formData.get("billing_email") as string,
            description: formData.get("description") as string,
        };

        const result = await updateOrganization(data);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Organization updated successfully");
            setOpen(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue={initialData.name} disabled />
                </div>
                <div className="space-y-2">
                    <Label>Subdomain</Label>
                    <Input defaultValue={initialData.subdomain} disabled />
                </div>
                <div className="space-y-2">
                    <Label>Billing Email</Label>
                    <Input defaultValue={initialData.billing_email} disabled />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Input defaultValue={initialData.description || ""} disabled />
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Edit Organization Details</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Organization</DialogTitle>
                        <DialogDescription>
                            Update your organization details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input id="name" name="name" defaultValue={initialData.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="billing_email" className="text-right">
                                    Email
                                </Label>
                                <Input id="billing_email" name="billing_email" type="email" defaultValue={initialData.billing_email} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Input id="description" name="description" defaultValue={initialData.description} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
