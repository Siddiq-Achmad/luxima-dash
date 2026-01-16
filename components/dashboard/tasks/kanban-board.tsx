"use client";

import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreHorizontal, Calendar, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanBoardProps {
    initialTasks: Task[];
}

const COLUMNS = [
    { id: "todo", title: "To Do", color: "bg-slate-100 dark:bg-slate-900 border-t-4 border-slate-500" },
    { id: "in_progress", title: "In Progress", color: "bg-blue-50 dark:bg-blue-950/30 border-t-4 border-blue-500" },
    { id: "review", title: "Review", color: "bg-orange-50 dark:bg-orange-950/30 border-t-4 border-orange-500" },
    { id: "done", title: "Done", color: "bg-green-50 dark:bg-green-950/30 border-t-4 border-green-500" },
];
import { TaskDialog } from "./task-dialog";

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Group tasks by status
    const tasksByStatus = COLUMNS.reduce((acc, col) => {
        acc[col.id] = tasks.filter(t => t.status === col.id);
        return acc;
    }, {} as Record<string, Task[]>);

    return (
        <div className="flex flex-col h-full gap-6 p-6 overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
                    <p className="text-muted-foreground">Visualize your workflow.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/tasks">View List</Link>
                    </Button>
                    <TaskDialog open={isAddOpen} onOpenChange={setIsAddOpen} mode="create">
                        <Button onClick={() => setIsAddOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </TaskDialog>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 h-full min-w-[1000px]">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className={`flex-1 rounded-lg p-4 flex flex-col gap-4 ${col.color}`}>
                            <div className="flex items-center justify-between font-semibold">
                                <span>{col.title}</span>
                                <Badge variant="secondary" className="bg-background/50">
                                    {tasksByStatus[col.id]?.length || 0}
                                </Badge>
                            </div>

                            <div className="flex flex-col gap-3 overflow-y-auto">
                                {tasksByStatus[col.id]?.map((task) => (
                                    <Card key={task.id} className="cursor-move hover:shadow-md transition-shadow">
                                        <CardHeader className="p-4 pb-2 space-y-0">
                                            <div className="flex justify-between items-start">
                                                <Badge
                                                    variant="outline"
                                                    className={`mb-2 capitalize ${task.priority === 'high' ? 'text-red-500 border-red-200' :
                                                        task.priority === 'medium' ? 'text-yellow-500 border-yellow-200' :
                                                            'text-blue-500 border-blue-200'
                                                        }`}
                                                >
                                                    {task.priority}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2">
                                                            <MoreHorizontal className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/tasks/${task.id}`}>View Details</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Move to Next Status</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <Link href={`/tasks/${task.id}`} className="font-semibold text-sm hover:underline line-clamp-2">
                                                {task.title}
                                            </Link>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2">
                                            {task.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                {task.due_date && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(task.due_date), "MMM d")}
                                                    </span>
                                                )}
                                                {task.assignee_id && (
                                                    <User className="h-3 w-3" />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {(!tasksByStatus[col.id] || tasksByStatus[col.id].length === 0) && (
                                    <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg border-muted">
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
