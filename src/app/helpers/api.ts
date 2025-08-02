import { User } from "@/app/types/user";

function getBaseUrl() {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.NODE_ENV === "production") {
        console.warn("Missing NEXTAUTH_URL or VERCEL_URL in production!");
    }
    return "http://localhost:3000";
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const baseUrl = getBaseUrl();
    const res = await fetch(
        `${baseUrl}/api/user?email=${encodeURIComponent(email)}`,
        {
            cache: "no-store",
        }
    );
    if (!res.ok) return null;
    return res.json();
}

export async function getProjectsByUserId(
    userId: number,
    page = 1,
    pageSize = 12
) {
    const baseUrl = getBaseUrl();
    const res = await fetch(
        `${baseUrl}/api/project?userId=${userId}&page=${page}&pageSize=${pageSize}`,
        {
            cache: "no-store",
        }
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }
    return res.json(); // { projects, total }
}

export async function createProject(data: {
    name: string;
    description?: string;
    ownerId: number;
}) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/project`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error(`Failed to create project: ${res.statusText}`);
    }
    return res.json();
}

export async function getProjectById(projectId: number, cookieHeader?: string) {
    const baseUrl = getBaseUrl();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
    }
    const res = await fetch(`${baseUrl}/api/project/${projectId}`, {
        cache: "no-store",
        headers,
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch project: ${res.statusText}`);
    }
    return res.json(); // { project }
}

export async function createTask(
    projectId: number,
    data: {
        title: string;
        description: string;
        assignedToId?: number;
    }
) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/project/${projectId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error(`Failed to create task: ${res.statusText}`);
    }
    return res.json(); // { task }
}

export async function updateTaskStatus(
    projectId: number,
    taskId: number,
    status: string
) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/project/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, status }),
    });
    if (!res.ok) {
        throw new Error(`Failed to update task status: ${res.statusText}`);
    }
    return res.json(); // { task }
}
