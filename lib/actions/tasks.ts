"use server";

import { DUMMY_TASKS } from "@/lib/dummy-data";
import { Task } from "@/lib/types";
// Mock actions for Tasks
export async function getTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_TASKS;
}

export async function getTaskById(id: string): Promise<Task | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_TASKS.find(t => t.id === id);
}

export async function createTask(_data: Partial<Task>): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate creation
    return { success: true };
}

export async function updateTask(_id: string, _data: Partial<Task>): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

export async function deleteTask(_id: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}
