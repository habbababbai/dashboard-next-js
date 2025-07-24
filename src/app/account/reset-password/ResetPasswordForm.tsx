"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push("/account");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: newPassword,
                    currentPassword,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(
                    "Password updated successfully. You will be redirected to your account page."
                );
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError(data.error || "Failed to update password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">
                Reset Password
            </h2>
            <label className="block mb-2">Current Password</label>
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded pr-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            <label className="block mb-2">New Password</label>
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            <label className="block mb-2">Confirm New Password</label>
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && (
                <div className="mb-4 text-green-600 text-sm">{success}</div>
            )}
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Updating..." : "Update Password"}
            </button>
        </form>
    );
}
