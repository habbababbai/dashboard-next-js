import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import type { AuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt" as const,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user) {
                    throw new Error("Invalid credentials");
                }
                const valid = await compare(
                    credentials.password,
                    user.password
                );
                if (!valid) {
                    throw new Error("Invalid credentials");
                }
                // Return user object (without password)
                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    pages: {
        signIn: "/signin",
        // You can add error, signOut, etc. if you want custom pages
    },
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user && token.sub) {
                (session.user as Record<string, unknown>).id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = async (req: Request, ctx: unknown) => {
    if (req.method === "POST") {
        try {
            const contentType = req.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const body = await req.json();
                if (body.action === "register") {
                    const { name, email, password } = body;
                    if (!name || !email || !password) {
                        return new Response(
                            JSON.stringify({
                                error: "All fields are required.",
                            }),
                            { status: 400 }
                        );
                    }
                    const existingUser = await prisma.user.findUnique({
                        where: { email },
                    });
                    if (existingUser) {
                        return new Response(
                            JSON.stringify({ error: "Email already in use." }),
                            { status: 409 }
                        );
                    }
                    const hashedPassword = await hash(password, 10);
                    await prisma.user.create({
                        data: { name, email, password: hashedPassword },
                    });
                    return new Response(JSON.stringify({ success: true }), {
                        status: 201,
                    });
                }
            }
        } catch (error) {
            return new Response(JSON.stringify({ error: "Server error." }), {
                status: 500,
            });
        }
    }
    // Fallback to NextAuth for all other requests
    return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };
