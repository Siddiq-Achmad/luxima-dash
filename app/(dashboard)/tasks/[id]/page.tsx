import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowLeft, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getTaskById } from "@/lib/actions/tasks";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
    const { id } = await params;
    const task = await getTaskById(id);

    if (!task) {
        notFound();
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'in_progress': return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'review': return <AlertCircle className="h-5 w-5 text-orange-500" />;
            default: return <Circle className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/tasks">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Task Details</h1>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className={`capitalize ${getPriorityColor(task.priority)}`}>
                                            {task.priority} Priority
                                        </Badge>
                                        <Badge variant="secondary" className="capitalize">
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{task.title}</CardTitle>
                                </div>
                                {getStatusIcon(task.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                                <p className="text-sm leading-relaxed">
                                    {task.description || "No description provided."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Activity log coming soon...</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Assignee</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                                        {task.profiles?.full_name?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm font-medium">{task.profiles?.full_name || "Unassigned"}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Due Date</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Created</span>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {format(new Date(task.created_at), "MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full" variant="outline">
                        Edit Task
                    </Button>
                    <Button className="w-full" variant="destructive">
                        Delete Task
                    </Button>
                </div>
            </div>
        </div>
    );
}
