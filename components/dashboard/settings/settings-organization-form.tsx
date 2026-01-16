"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrganization } from "@/lib/actions/organization";
import { toast } from "sonner";
import { Tenant } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

type SettingsOrgFormProps = {
    initialData: Partial<Tenant>;
};

export function SettingsOrganizationForm({ initialData }: SettingsOrgFormProps) {
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
            toast.success("Settings updated successfully");
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">Organization Name</label>
                    <Input id="name" name="name" defaultValue={initialData.name} required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="subdomain">Subdomain</label>
                    <Input id="subdomain" defaultValue={initialData.subdomain} disabled />
                    <p className="text-xs text-muted-foreground">
                        {initialData.subdomain ? `${initialData.subdomain}.luxima.id` : "Not configured"}
                    </p>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="billing_email">Billing Email</label>
                <Input id="billing_email" name="billing_email" defaultValue={initialData.billing_email} type="email" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">Description</label>
                <Input id="description" name="description" defaultValue={initialData.description || ""} />
            </div>
            <Separator />
            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
