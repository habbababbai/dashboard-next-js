"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function SignInForm() {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/projects");
        }
    }, [status, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        setLoading(false);
        if (res && res.ok) {
            router.push("/");
        } else {
            setError(res?.error || "Sign in failed");
        }
    }

    if (status === "loading" || status === "authenticated") {
        return <div>Loading...</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
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
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}
