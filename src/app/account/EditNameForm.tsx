"use client";
import { useState } from "react";

export default function EditNameForm({
    currentName,
    onSuccess,
}: {
    currentName: string;
    onSuccess: (newName: string) => void;
}) {
    const [name, setName] = useState(currentName);
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
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess(name);
            } else {
                setError(data.error || "Failed to update name.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
            <input
                type="text"
                className="px-2 py-1 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
