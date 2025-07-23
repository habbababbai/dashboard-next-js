import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return <div>You must be signed in to view your account.</div>;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">Account Details</h1>
            <div className="mb-1">Name: {user.name}</div>
            <div className="mb-1">Email: {user.email}</div>
            <div className="text-sm text-gray-500 mb-4">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <a
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition inline-block"
                href="/account/delete"
            >
                Delete Account
            </a>
        </div>
    );
}
