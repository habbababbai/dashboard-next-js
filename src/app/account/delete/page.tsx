import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DeleteButton from "./DeleteButton";

export const metadata = { title: "Delete Account | Dashboard App" };

export default async function DeleteAccountPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return <div>You must be signed in to delete your account.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-6 text-red-600">
                    Confirm Account Deletion
                </h2>
                <p className="mb-6">
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                </p>
                <div>
                    <DeleteButton email={session.user.email} />
                    <a
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                        href="/account"
                    >
                        Cancel
                    </a>
                </div>
            </div>
        </div>
    );
}
