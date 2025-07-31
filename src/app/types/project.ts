import { User } from "@/app/types/user";

export interface Task {
    id: number;
    title: string;
    status: string;
    assignedTo?: {
        id: number;
        name: string;
    };
    description: string;
    createdAt: string;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    owner: {
        id: number;
        name: string;
        email: string;
    };
    tasks: Task[];
}

export interface TaskWithAssigned extends Task {
    assignedTo?: User;
}

export interface ProjectWithRelations extends Project {
    description?: string;
    owner: User;
    contributors: User[];
    tasks: TaskWithAssigned[];
}