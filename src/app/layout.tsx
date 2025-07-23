import Link from "next/link";
import "./globals.css";
import { cookies } from "next/headers";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Await cookies() if it returns a Promise in this Next.js version
    const cookieStore = await cookies();
    const isLoggedIn = Boolean(cookieStore.get("auth"));

    return (
        <html lang="en">
            <body>
                <header className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-background">
                    <Link href="/">
                        <span className="text-xl font-bold tracking-tight">
                            Dashboard App
                        </span>
                    </Link>
                    {isLoggedIn ? (
                        <button
                            className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                            disabled
                        >
                            Signed In
                        </button>
                    ) : (
                        <Link href="/signin">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                Sign In
                            </button>
                        </Link>
                    )}
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}
