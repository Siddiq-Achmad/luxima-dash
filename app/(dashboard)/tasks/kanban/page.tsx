import { KanbanBoard } from "@/components/dashboard/tasks/kanban-board";
import { getTasks } from "@/lib/actions/tasks";

export default async function KanbanPage() {
    const tasks = await getTasks();

    return <KanbanBoard initialTasks={tasks} />;
}
