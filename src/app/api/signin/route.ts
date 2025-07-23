import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }
        const valid = await compare(password, user.password);
        if (!valid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }
        // Set a simple auth cookie with user id (not secure for production)
        const res = NextResponse.json({ message: "Signed in successfully" });
        res.cookies.set("auth", String(user.id), {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        return res;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
