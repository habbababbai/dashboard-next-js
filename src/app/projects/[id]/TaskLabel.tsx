"use client";

import { useState } from "react";
import { formatDate } from "@/app/helpers/project";
import { TaskWithAssigned } from "@/app/types/project";
import { updateTaskStatus } from "@/app/helpers/api";

export default function TaskLabel(task: TaskWithAssigned) {
    const [currentStatus, setCurrentStatus] = useState(task.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

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

    function getStatusBadgeColor(status: string): string {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "todo":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    }

    function getStatusText(status: string): string {
        switch (status) {
            case "completed":
                return "Completed";
            case "in_progress":
                return "In Progress";
            case "todo":
                return "To Do";
            default:
                return "To Do";
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;

        setIsUpdating(true);
        setError("");

        try {
            await updateTaskStatus(task.projectId, task.id, newStatus);
            setCurrentStatus(newStatus);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update status"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div key={task.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className={`w-3 h-3 rounded-full ${getTaskStatusColor(
                                currentStatus
                            )}`}
                        />
                        <h4 className="text-lg font-medium text-white">
                            {task.title}
                        </h4>
                    </div>
                    {task.description && (
                        <p className="text-gray-300 mb-3">{task.description}</p>
                    )}

                    {/* Status Section */}
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                                Status:
                            </span>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                                    currentStatus
                                )}`}
                            >
                                {getStatusText(currentStatus)}
                            </span>
                        </div>
                        <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {isUpdating && (
                            <span className="text-sm text-gray-400">
                                Updating...
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="mb-3 text-sm text-red-400">{error}</div>
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
