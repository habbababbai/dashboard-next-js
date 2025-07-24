// Server component
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import AccountPageClient from "./AccountPageClient";

export const metadata = { title: "Account | Dashboard App" };

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

    // Format the joined date on the server to avoid hydration errors
    const joinedDate = user.createdAt.toLocaleDateString("en-US");

    return (
        <AccountPageClient
            user={{
                name: user.name,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
                joinedDate,
            }}
        />
    );
}
