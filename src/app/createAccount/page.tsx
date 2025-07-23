"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CreateAccountPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/[...nextauth]", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "register",
                    name,
                    email,
                    password,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                // Automatically sign in the user
                const signInRes = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });
                if (signInRes && signInRes.ok) {
                    router.push("/");
                } else {
                    router.push("/signin");
                }
            } else {
                setError(data.error || "Account creation failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded shadow"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h2>
                <label className="block mb-2">Name</label>
                <input
                    type="text"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label className="block mb-2">Email</label>
                <input
                    type="email"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="block mb-2">Password</label>
                <input
                    type="password"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}
