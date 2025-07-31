import { formatDate } from "@/app/helpers/project";
import { TaskWithAssigned } from "@/app/projects/[id]/ProjectDetailsClient";

export default function TaskLabel(task: TaskWithAssigned) {
    function getTaskStatusColor(status: string): string {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "in_progress":
                return "bg-blue-500";
            case "todo":
                return "bg-gray-500";
            default:
                return "bg-gray-500";
        }
    }
    return (
        <div key={task.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className={`w-3 h-3 rounded-full ${getTaskStatusColor(
                                task.status
                            )}`}
                        />
                        <h4 className="text-lg font-medium text-white">
                            {task.title}
                        </h4>
                    </div>
                    {task.description && (
                        <p className="text-gray-300 mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        {task.assignedTo && (
                            <div className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                {task.assignedTo.name}
                            </div>
                        )}
                        <div className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {formatDate(task.createdAt)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
