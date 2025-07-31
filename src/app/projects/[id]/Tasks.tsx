import { ProjectWithRelations } from "@/app/types/project";
import TaskLabel from "@/app/projects/[id]/TaskLabel";

interface ProjectInfoProps {
    project: ProjectWithRelations;
}

export default function Tasks({
    project,
}: ProjectInfoProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Tasks</h3>
            </div>
            {project.tasks.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-4">
                        <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        No tasks yet
                    </h3>
                    <p className="text-gray-400">
                        Get started by adding your first task to this project.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {project.tasks.map((task) => (
                        <TaskLabel key={task.id} {...task} />
                    ))}
                </div>
            )}
        </div>
    );
}
