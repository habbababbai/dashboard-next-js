"use client";

import { useState } from "react";
import type { Project } from "@/app/types/project";

export interface ProjectsClientProps {
    initialProjects: Project[];
    total: number;
    page: number;
    pageSize: number;
}

export default function ProjectsClient({
    initialProjects,
    total,
    page,
    pageSize,
}: ProjectsClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Filter projects based on search term and status
    const filteredProjects = initialProjects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        if (filterStatus === "all") return matchesSearch;

        const projectStatus = getProjectStatus(project);
        return matchesSearch && projectStatus === filterStatus;
    });

    function getProjectStatus(project: Project): string {
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

    function getStatusIcon(status: string) {
        switch (status) {
            case "completed":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                );
            case "in-progress":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            case "not-started":
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
        }
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    function goToPage(newPage: number) {
        const params = new URLSearchParams(window.location.search);
        params.set("page", newPage.toString());
        window.location.search = params.toString();
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Projects</option>
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        No projects found
                    </h3>
                    <p className="text-gray-400">
                        {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "Get started by creating your first project."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const status = getProjectStatus(project);
                        const completedTasks = project.tasks.filter(
                            (task) => task.status === "completed"
                        ).length;
                        const totalTasks = project.tasks.length;

                        return (
                            <div
                                key={project.id}
                                className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:shadow-lg hover:border-gray-600 transition-all duration-200"
                            >
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
                                            <span>
                                                Owner: {project.owner.name}
                                            </span>
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
                                            <span>
                                                Created:{" "}
                                                {formatDate(project.createdAt)}
                                            </span>
                                        </div>

                                        {totalTasks > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-400">
                                                    Progress
                                                </span>
                                                <span className="text-sm font-medium text-white">
                                                    {completedTasks}/
                                                    {totalTasks} tasks
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
                                                            (completedTasks /
                                                                totalTasks) *
                                                            100
                                                        }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <button
                                            disabled
                                            className="flex-1 bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed transition-colors duration-200"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            disabled
                                            className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed transition-colors duration-200"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                >
                    Previous
                </button>
                <span className="text-white">
                    Page {page} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>

            {/* Create New Project Button */}
            <div className="text-center pt-8">
                <button
                    disabled
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-600 cursor-not-allowed transition-colors duration-200"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Create New Project
                </button>
            </div>
        </div>
    );
}
