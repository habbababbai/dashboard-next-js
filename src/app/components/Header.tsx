"use client";
import { useSession, signOut } from "next-auth/react";
import HeaderButton from "./HeaderButton";

export default function Header() {
    const { data: session, status } = useSession();
    const isLoggedIn = Boolean(session);

    return (
        <header className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-background">
            <div className="flex items-center gap-8">
                <HeaderButton
                    href="/"
                    className="text-xl font-bold tracking-tight"
                >
                    Dashboard App
                </HeaderButton>
                {isLoggedIn && (
                    <HeaderButton href="/projects">Projects</HeaderButton>
                )}
            </div>

            {isLoggedIn ? (
                <div className="flex gap-4 items-center">
                    <HeaderButton href="/account">Account</HeaderButton>
                    <HeaderButton
                        onClick={() => signOut({ callbackUrl: "/signedout" })}
                    >
                        Sign Out
                    </HeaderButton>
                </div>
            ) : (
                <div className="flex gap-4">
                    <HeaderButton href="/signin">Sign In</HeaderButton>
                    <HeaderButton href="/createAccount">
                        Create Account
                    </HeaderButton>
                </div>
            )}
        </header>
    );
}
