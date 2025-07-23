import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { hash } from "bcryptjs";

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const body = await request.json();
            const { name, email, password } = body;
            if (!name || !email || !password) {
                return new Response(
                    JSON.stringify({ error: "All fields are required." }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return new Response(
                    JSON.stringify({ error: "Email already in use." }),
                    {
                        status: 409,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
            const hashedPassword = await hash(password, 10);
            await prisma.user.create({
                data: { name, email, password: hashedPassword },
            });
            return new Response(JSON.stringify({ success: true }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(
            JSON.stringify({ error: "Invalid content type." }),
            {
                status: 415,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
