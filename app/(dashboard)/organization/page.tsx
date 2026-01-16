import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantSettings } from "@/lib/data/settings";
import { OrganizationForm } from "@/components/dashboard/organization/organization-form";

export default async function OrganizationPage() {
    const settings = await getTenantSettings();

    if (!settings) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Not Found</CardTitle>
                        <CardDescription>
                            Please contact support or ensure your account is set up correctly.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Organization</h2>
                <p className="text-muted-foreground">
                    Manage your organization profile
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Profile</CardTitle>
                    <CardDescription>
                        This information will be displayed on your invoices and public profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <OrganizationForm initialData={settings} />
                </CardContent>
            </Card>
        </div>
    );
}
