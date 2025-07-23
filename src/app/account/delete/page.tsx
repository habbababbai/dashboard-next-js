"use client";
import { usePageTitle } from "@/app/hooks/common";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DeleteAccountPage() {
    const { data: session } = useSession();
    const email = session?.user?.email;
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    usePageTitle("Delete Account | Dashboard App");

    async function handleDelete() {
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetch(
                `/api/user?email=${encodeURIComponent(email)}`,
                {
                    method: "DELETE",
                }
            );
            if (res.ok) {
                await signOut({ callbackUrl: "/signedout" });
            } else {
                const data = await res.json();
                setError(data.error || "Failed to delete account.");
            }
        } catch (err) {
            setError("Failed to delete account.");
        }
        setLoading(false);
    }

    function handleCancel() {
        router.push("/account");
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-6 text-red-600">
                    Confirm Account Deletion
                </h2>
                <p className="mb-6">
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                </p>
                {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}
                <div className="flex gap-4 justify-center">
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
