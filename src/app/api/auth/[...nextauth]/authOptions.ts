import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
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
        signOut: "/signedout",
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
