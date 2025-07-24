import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
const { hash, compare } = await import("bcryptjs");

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return new Response(
            JSON.stringify({ error: "Email query parameter is required." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found." }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;

    return new Response(JSON.stringify(userWithoutPassword), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!session || !session.user?.email) {
        return new Response(
            JSON.stringify({ error: "Unauthorized. You must be signed in." }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (!email) {
        return new Response(
            JSON.stringify({ error: "Email query parameter is required." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (email !== session.user.email) {
        return new Response(
            JSON.stringify({
                error: "Forbidden. You can only delete your own account.",
            }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const deletedUser = await prisma.user.delete({
            where: { email },
        });
        // Exclude password from response
        const { password, ...userWithoutPassword } = deletedUser;
        return new Response(
            JSON.stringify({ success: true, user: userWithoutPassword }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "User not found or could not be deleted.",
            }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return new Response(
            JSON.stringify({ error: "Unauthorized. You must be signed in." }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const body = await request.json();
    const { name, email, password, currentPassword } = body;

    // Only allow updating own data
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found." }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
        // If currentPassword is provided, verify it
        if (currentPassword) {
            const isMatch = await compare(currentPassword, user.password);
            if (!isMatch) {
                return new Response(
                    JSON.stringify({ error: "Current password is incorrect." }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
        }
        updateData.password = await hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
        return new Response(
            JSON.stringify({ error: "No valid fields to update." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
        });
        // Exclude password from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = updatedUser;
        return new Response(
            JSON.stringify({ success: true, user: userWithoutPassword }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch {
        return new Response(
            JSON.stringify({ error: "Failed to update user." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// POST handler removed; this endpoint now only supports GET for fetching user data.
