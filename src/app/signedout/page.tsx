import Link from "next/link";

export default function SignedOutPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-4">
                    You have been signed out
                </h2>
                <p className="mb-4">
                    You may now close this window or return to the landing page.
                </p>
                <Link href="/">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Go to Landing Page
                    </button>
                </Link>
            </div>
        </div>
    );
}
