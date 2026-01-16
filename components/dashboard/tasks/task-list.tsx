"use client";

import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Removed unused imports
import { MoreVertical, Plus, CheckCircle2, AlertCircle, Flag, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskDialog } from "./task-dialog";

interface TaskListProps {
    initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Stats logic
    const total = initialTasks.length;
    const todo = initialTasks.filter(t => t.status === "todo").length;
    const done = initialTasks.filter(t => t.status === "done").length;
    const review = initialTasks.filter(t => t.status === "review").length;
    const blocker = initialTasks.filter(t => t.priority === "high").length; // Using high priority as proxy for blocker

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(initialTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTasks = initialTasks.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground mt-1">You have {total} tasks</p>
                </div>
                <div className="flex gap-3">
                    <TaskDialog open={isAddOpen} onOpenChange={setIsAddOpen} mode="create">
                        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Add Tasks
                        </Button>
                    </TaskDialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <div className="h-6 w-6 grid grid-cols-2 gap-[1px]">
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{todo}</div>
                        <div className="text-sm text-muted-foreground">To do</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{done}</div>
                        <div className="text-sm text-muted-foreground">Tasks completed</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <div className="h-6 w-6 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">
                            <span className="mb-[1px]">↻</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{review}</div>
                        <div className="text-sm text-muted-foreground">In Review</div>
                    </div>
                </Card>
                <Card className="flex flex-row items-center p-4 gap-8 shadow-sm border-none">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{blocker}</div>
                        <div className="text-sm text-muted-foreground">Blocker</div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <Button variant="default" size="sm" className=" text-white rounded-md px-6">
                    All
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Pin <Badge variant="secondary" className="ml-2 h-5 min-w-5 justify-center px-1">3</Badge>
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-muted/20">
                        <TableRow className="border-b-0 hover:bg-transparent">
                            <TableHead className="py-4 font-semibold w-[400px]">Project Name</TableHead>
                            <TableHead className="py-4 font-semibold">Status</TableHead>
                            <TableHead className="py-4 font-semibold">Date</TableHead>
                            <TableHead className="py-4 font-semibold">Priority</TableHead>
                            <TableHead className="py-4 font-semibold">Time Spent</TableHead>
                            <TableHead className="py-4 font-semibold">Estimation</TableHead>
                            <TableHead className="py-4 font-semibold text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTasks.map((task) => (
                            <TableRow key={task.id} className="hover:bg-gray-50/50 dark:hover:bg-muted/20 border-gray-100 dark:border-border">
                                <TableCell className="py-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${task.priority === 'high' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {task.priority === 'high' ? <Flag className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{task.profiles?.full_name || "Unassigned"}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${task.status === 'done' ? 'bg-green-500' :
                                            task.status === 'in_progress' ? 'bg-blue-500' :
                                                'bg-gray-300'
                                            }`} />
                                        <span className={`capitalize font-medium ${task.status === 'done' ? 'text-green-600' :
                                            task.status === 'in_progress' ? 'text-blue-600' :
                                                'text-gray-500'
                                            }`}>{task.status.replace('_', ' ')}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground">
                                    {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "-"}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'medium' ? 'bg-orange-500' :
                                                'bg-blue-500'
                                            }`} />
                                        <span className="capitalize text-muted-foreground font-medium">{task.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground">
                                    3hrs 20m
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground">
                                    5hrs
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/tasks/${task.id}`}>View Details</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
