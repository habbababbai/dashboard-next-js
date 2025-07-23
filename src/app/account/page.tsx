"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@/app/types/user";
import { getUserByEmail } from "@/app/helpers/api";
import { usePageTitle } from "@/app/hooks/common";

export default function AccountPage() {
    usePageTitle("Account | Dashboard App");
    const { data: session } = useSession();
    const email = session?.user?.email;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!email) {
            setLoading(false);
            return;
        }
        getUserByEmail(email)
            .then((u) => setUser(u))
            .catch(() => setError("Failed to fetch user."))
            .finally(() => setLoading(false));
    }, [email]);

    if (loading) return <div>Loading...</div>;
    if (!email) return <div>You must be signed in to view your account.</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>User not found.</div>;

    function handleNavigateToDelete() {
        router.push("/account/delete");
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">Account Details</h1>
            <div className="mb-1">Name: {user.name}</div>
            <div className="mb-1">Email: {user.email}</div>
            <div className="text-sm text-gray-500 mb-4">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={handleNavigateToDelete}
            >
                Delete Account
            </button>
        </div>
    );
}
