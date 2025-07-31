import { User } from "@/app/types/user";

function getBaseUrl() {
    if (typeof window !== "undefined") {
        return "";
    }
    return (
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000")
    );
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
