"use client";
import { useState } from "react";
import Link from "next/link";
import type {  ProjectWithRelations} from "@/app/types/project";
import TabButton from "@/app/projects/[id]/TabButton";
import ProjectInfo from "./ProjectInfo";
import Tasks from "./Tasks";
import AddTask from "./AddTask";

export interface ProjectDetailsClientProps {
    project: ProjectWithRelations;
}

export default function ProjectDetailsClient({
    project,
}: ProjectDetailsClientProps) {
    const [activeTab, setActiveTab] = useState<
        "overview" | "tasks" | "addTask"
    >("overview");
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
                    <TabButton
                        onClick={() => setActiveTab("overview")}
                        activeTab={activeTab === "overview"}
                        title={"Overview"}
                    />
                    <TabButton
                        onClick={() => {
                            setActiveTab("tasks");
                        }}
                        activeTab={activeTab === "tasks"}
                        title={`Tasks (${totalTasks})`}
                    />
                    <TabButton
                        onClick={() => {
                            setActiveTab("addTask");
                        }}
                        activeTab={activeTab === "addTask"}
                        title={"Add Task"}
                    />
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <ProjectInfo
                    project={project}
                    completedTasks={completedTasks}
                    totalTasks={totalTasks}
                />
            )}

            {activeTab === "tasks" && <Tasks project={project} />}
            {activeTab === "addTask" && <AddTask />}
        </div>
    );
}
