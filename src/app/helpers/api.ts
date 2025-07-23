import { User } from "@/app/types/user";

export async function getUserByEmail(email: string): Promise<User | null> {
    const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}
