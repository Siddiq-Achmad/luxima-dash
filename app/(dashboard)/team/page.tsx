import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MoreHorizontal, Mail, Shield } from "lucide-react";
import { getTeamMembers } from "@/lib/data/team";
import { format } from "date-fns";

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

export default async function TeamPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Team</h2>
                    <p className="text-muted-foreground">
                        Manage your organization team members
                    </p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                        {teamMembers.length} members in your organization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {teamMembers.map((member: any) => (
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
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {teamMembers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No team members found.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
