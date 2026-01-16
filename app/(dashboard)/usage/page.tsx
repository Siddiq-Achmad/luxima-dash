import { DUMMY_USAGE_RECORDS } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

export default function UsagePage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usage Records</h1>
                    <p className="text-muted-foreground">Monitor your resource usage and limits.</p>
                </div>
                <Button variant="outline">
                    <Activity className="mr-2 h-4 w-4" /> Download Report
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {DUMMY_USAGE_RECORDS.map((record) => (
                    <Card key={record.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {record.resource_name}
                            </CardTitle>
                            <Badge variant={record.status === "normal" ? "outline" : record.status === "warning" ? "secondary" : "destructive"}>
                                {record.status.toUpperCase()}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {record.usage_value} <span className="text-sm font-normal text-muted-foreground">/ {record.limit_value} {record.unit}</span>
                            </div>
                            <Progress
                                value={(record.usage_value / record.limit_value) * 100}
                                className="mt-4"

                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Period: {new Date(record.period_start).toLocaleDateString()} - {new Date(record.period_end).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
