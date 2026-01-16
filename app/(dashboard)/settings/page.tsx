import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Building2, Shield, Bell, Palette } from "lucide-react";
import { getTenantSettings } from "@/lib/data/settings";
import { SettingsOrganizationForm } from "@/components/dashboard/settings/settings-organization-form";

export default async function SettingsPage() {
    const settings = await getTenantSettings();

    if (!settings) {
        return <div>Organization settings not found.</div>;
    }

    const tenantSettings = settings as Record<string, unknown> || {};

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your organization settings and preferences
                </p>
            </div>

            {/* Organization Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <CardTitle>Organization</CardTitle>
                    </div>
                    <CardDescription>
                        Basic organization information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsOrganizationForm initialData={settings} />
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>
                        Security and access settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">
                                Add an extra layer of security
                            </div>
                        </div>
                        <Button variant="outline" disabled>Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">API Keys</div>
                            <div className="text-sm text-muted-foreground">
                                Manage API access tokens
                            </div>
                        </div>
                        <Button variant="outline" disabled>Manage</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Configure notification preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">
                                Receive booking and payment updates
                            </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                            Enabled
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>Customize your dashboard theme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Theme</div>
                            <div className="text-sm text-muted-foreground">
                                Current: {(tenantSettings.theme as string) || "System"}
                            </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                            Modify
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
