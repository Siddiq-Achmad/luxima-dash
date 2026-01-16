import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function MarketingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
                <p className="text-muted-foreground">Manage your marketing campaigns and leads.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5" />
                        Under Construction
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The Marketing module is coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
