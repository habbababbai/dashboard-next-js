"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project, Task } from "@/app/types/project";
import type { User } from "@/app/types/user";
import TaskLabel from "./TaskLabel";
import { formatDate } from "@/app/helpers/project";

export interface TaskWithAssigned extends Task {
    assignedTo?: User;
}

interface ProjectWithRelations extends Project {
    description?: string;
    owner: User;
    contributors: User[];
    tasks: TaskWithAssigned[];
}

export interface ProjectDetailsClientProps {
    project: ProjectWithRelations;
}

export default function ProjectDetailsClient({
    project,
}: ProjectDetailsClientProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "tasks">(
        "overview"
    );

    function getProjectStatus(): string {
        if (project.tasks.length === 0) return "not-started";

        const completedTasks = project.tasks.filter(
            (task) => task.status === "completed"
        ).length;
        const totalTasks = project.tasks.length;

        if (completedTasks === 0) return "not-started";
        if (completedTasks === totalTasks) return "completed";
        return "in-progress";
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in-progress":
                return "bg-blue-100 text-blue-800";
            case "not-started":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }


    const projectStatus = getProjectStatus();
    const completedTasks = project.tasks.filter(
        (task) => task.status === "completed"
    ).length;
    const totalTasks = project.tasks.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/projects">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                ← Back to Projects
                            </button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {project.name}
                    </h1>
                    {project.description && (
                        <p className="text-gray-300 text-lg">
                            {project.description}
                        </p>
                    )}
                </div>
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        projectStatus
                    )}`}
                >
                    {projectStatus.replace("-", " ")}
                </span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === "overview"
                                ? "border-blue-500 text-blue-400"
                                : "border-transparent text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === "tasks"
                                ? "border-blue-500 text-blue-400"
                                : "border-transparent text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        Tasks ({totalTasks})
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Project Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Project Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <svg
                                        className="w-5 h-5 mr-3"
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
                                {project.contributors.length > 0 && (
                                    <div className="flex items-center text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        <span>
                                            Contributors:{" "}
                                            {project.contributors
                                                .map((c) => c.name)
                                                .join(", ")}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center text-gray-300">
                                    <svg
                                        className="w-5 h-5 mr-3"
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
                                    <span>
                                        Created: {formatDate(project.createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <svg
                                        className="w-5 h-5 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <span>Total Tasks: {totalTasks}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        {totalTasks > 0 && (
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Progress
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">
                                            Completed
                                        </span>
                                        <span className="text-white font-medium">
                                            {completedTasks}/{totalTasks}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    (completedTasks /
                                                        totalTasks) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {Math.round(
                                            (completedTasks / totalTasks) * 100
                                        )}
                                        % complete
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "tasks" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">
                            Tasks
                        </h3>
                        <button
                            disabled
                            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lgtransition-colors"
                        >
                            Add Task
                        </button>
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
                                Get started by adding your first task to this
                                project.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {project.tasks.map((task) => (
                                <TaskLabel key={task.id} {...task}/>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
