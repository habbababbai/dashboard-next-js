import Link from "next/link";
import type { Project } from "@/app/types/project";
import React from "react";

interface ProjectCardProps {
    project: Project;
    getProjectStatus: (project: Project) => string;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => React.ReactElement;
    formatDate: (dateString: string) => string;
}

export default function ProjectCard({
    project,
    getProjectStatus,
    getStatusColor,
    getStatusIcon,
    formatDate,
}: ProjectCardProps) {
    const status = getProjectStatus(project);
    const completedTasks = project.tasks.filter(
        (task) => task.status === "completed"
    ).length;
    const totalTasks = project.tasks.length;

    return (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:shadow-lg hover:border-gray-600 transition-all duration-200">
            <div className="p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {project.name}
                        </h3>
                        {project.description && (
                            <p className="text-sm text-gray-300 line-clamp-2">
                                {project.description}
                            </p>
                        )}
                    </div>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            status
                        )}`}
                    >
                        {getStatusIcon(status)}
                        <span className="ml-1 capitalize">
                            {status.replace("-", " ")}
                        </span>
                    </span>
                </div>

                {/* Project Stats */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                        <svg
                            className="w-4 h-4 mr-2"
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
                        <span>Owner: {project.owner.name}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-400">
                        <svg
                            className="w-4 h-4 mr-2"
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
                        <span>Created: {formatDate(project.createdAt)}</span>
                    </div>

                    {totalTasks > 0 && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                                Progress
                            </span>
                            <span className="text-sm font-medium text-white">
                                {completedTasks}/{totalTasks} tasks
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {totalTasks > 0 && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${
                                        (completedTasks / totalTasks) * 100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Link href={`/projects/${project.id}`}>
                        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
