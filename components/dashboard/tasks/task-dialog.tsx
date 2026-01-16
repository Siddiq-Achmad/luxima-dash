"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";
import { useState } from "react";
import { createTask, updateTask } from "@/lib/actions/tasks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TaskDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    mode?: "create" | "edit";
    task?: Task;
    children?: React.ReactNode;
}

export function TaskDialog({ open, onOpenChange, mode = "create", task, children }: TaskDialogProps) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = useState(false);

    // Controlled vs Uncontrolled
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        try {
            if (mode === "create") {
                await createTask(data);
                toast.success("Task created successfully");
            } else {
                await updateTask(task!.id, data);
                toast.success("Task updated successfully");
            }
            if (setIsOpen) setIsOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to save task");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
                        <DialogDescription>
                            {mode === "create" ? "Add a new task to your list." : "Update task details."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={task?.title} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={task?.description} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={task?.status || "todo"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select name="priority" defaultValue={task?.priority || "medium"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
