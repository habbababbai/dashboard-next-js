import { PrismaClient } from "@prisma/client";
const { hash } = await import("bcryptjs");

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

// POST handler removed; this endpoint now only supports GET for fetching user data.
