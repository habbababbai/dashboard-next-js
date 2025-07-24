"use client";
import { useState } from "react";

export default function EditEmailForm({
    currentEmail,
    onSuccess,
}: {
    currentEmail: string;
    onSuccess: (newEmail: string) => void;
}) {
    const [email, setEmail] = useState(currentEmail);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess(email);
            } else {
                setError(data.error || "Failed to update email.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
            <input
                type="email"
                className="px-2 py-1 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={loading}
            >
                Save
            </button>
            {error && (
                <span className="text-red-600 text-sm ml-2">{error}</span>
            )}
        </form>
    );
}
