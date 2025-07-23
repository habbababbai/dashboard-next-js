import { PrismaClient } from "@prisma/client";

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
