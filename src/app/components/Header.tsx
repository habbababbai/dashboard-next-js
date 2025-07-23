"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();
    const isLoggedIn = Boolean(session);
    return (
        <header className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-background">
            <Link href="/">
                <span className="text-xl font-bold tracking-tight">
                    Dashboard App
                </span>
            </Link>
            {isLoggedIn ? (
                <button
                    className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    Sign Out
                </button>
            ) : (
                <Link href="/signin">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </Link>
            )}
        </header>
    );
}
