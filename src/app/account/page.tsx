import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/app/types/user";
import { getUserByEmail } from "@/app/helpers/api";

export default async function AccountPage() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
        return <div>You must be signed in to view your account.</div>;
    }

    const user: User | null = await getUserByEmail(email);

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">Account Details</h1>
            <div className="mb-1">Name: {user.name}</div>
            <div className="mb-1">Email: {user.email}</div>
            <div className="text-sm text-gray-500">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}
