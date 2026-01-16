import { DUMMY_PROFILE, DUMMY_VENDOR } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and vendor profile.</p>
                </div>
                <Button>Save Changes</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={DUMMY_PROFILE.avatar_url || undefined} />
                                <AvatarFallback>{DUMMY_PROFILE.full_name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">Change Avatar</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={DUMMY_PROFILE.full_name || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue={DUMMY_PROFILE.email || ""} disabled />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Vendor Profile</CardTitle>
                        <CardDescription>Update your vendor details visible to clients.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="vendorName">Vendor Name</Label>
                            <Input id="vendorName" defaultValue={DUMMY_VENDOR.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" placeholder="Tell us about yourself..." className="min-h-[100px]" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
