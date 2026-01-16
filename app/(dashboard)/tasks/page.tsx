import { TaskList } from "@/components/dashboard/tasks/task-list";
import { getTasks } from "@/lib/actions/tasks";

export default async function TasksPage() {
    const tasks = await getTasks();

    return <TaskList initialTasks={tasks} />;
}
