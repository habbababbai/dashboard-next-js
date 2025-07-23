import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard App | Next.js + PostgreSQL",
    description:
        "A learning project to build a dashboard like Asana using Next.js, Tailwind CSS, and PostgreSQL.",
};

export default function LandingPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <h1 className="text-4xl font-bold mb-4">
                Welcome to the Dashboard App
            </h1>
            <p className="mb-4 text-lg max-w-2xl text-center">
                This project is a learning exercise to build a project dashboard
                similar to Asana, using Next.js, Tailwind CSS, and PostgreSQL.
                It demonstrates modern full-stack development practices,
                including authentication, database integration, and a clean UI.
            </p>
            <div className="mb-8 max-w-xl text-center text-base text-gray-700 dark:text-gray-300">
                <p className="mb-2">
                    Stack: Next.js (App Router), Tailwind CSS, PostgreSQL,
                    Prisma ORM.
                </p>
                <p className="mb-2">
                    Features include user authentication, project and task
                    management, and a responsive dashboard interface.
                </p>
                <div className="mb-2">
                    <span className="font-semibold">To get started:</span>
                    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 mt-2 text-left overflow-x-auto text-sm">
                        {`pnpm install
pnpm exec prisma migrate dev
pnpm exec ts-node prisma/seed.ts
pnpm dev`}
                    </pre>
                </div>
            </div>
            <Link href="/signin">
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Sign In
                </button>
            </Link>
        </main>
    );
}
