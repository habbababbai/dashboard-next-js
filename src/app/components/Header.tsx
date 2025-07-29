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
                <div className="flex gap-4 items-center">
                    <Link href="/account">
                        <button className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
                            Account
                        </button>
                    </Link>
                    <Link href="/projects">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Projects
                        </button>
                    </Link>
                    <button
                        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                        onClick={() => signOut({ callbackUrl: "/signedout" })}
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <div className="flex gap-4">
                    <Link href="/signin">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Sign In
                        </button>
                    </Link>
                    <Link href="/createAccount">
                        <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                            Create Account
                        </button>
                    </Link>
                </div>
            )}
        </header>
    );
}
