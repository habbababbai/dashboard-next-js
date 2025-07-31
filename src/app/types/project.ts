export interface Task {
    id: number;
    title: string;
    status: string;
    assignedTo?: {
        id: number;
        name: string;
    };
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
