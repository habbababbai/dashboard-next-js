import { User } from "@/app/types/User";

export async function getUserByEmail(email: string): Promise<User | null> {
    const baseUrl =
        process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:3000";
    const res = await fetch(
        `${baseUrl}/api/user?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
}
