"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DeleteButton({ email }: { email: string }) {
    const router = useRouter();

    async function handleDelete() {
        const res = await fetch(
            `/api/user?email=${encodeURIComponent(email)}`,
            {
                method: "DELETE",
            }
        );
        if (res.ok) {
            await signOut({ callbackUrl: "/signedout" });
        } else {
            alert("Failed to delete account.");
        }
    }

    return (
        <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition mr-4"
            onClick={handleDelete}
        >
            Yes, Delete My Account
        </button>
    );
}
