import { getTeamMembers } from "@/lib/data/team";
import { TeamList } from "@/components/dashboard/team/team-list";
import { TeamDialog } from "@/components/dashboard/team/team-dialog";

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
                <TeamDialog />
            </div>

            <TeamList members={teamMembers} />
        </div>
    );
}
