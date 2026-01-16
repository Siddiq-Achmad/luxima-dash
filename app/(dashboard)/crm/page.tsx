import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function CRMPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
                <p className="text-muted-foreground">Manage customer relationships and pipeline.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Under Construction
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The CRM module is coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
