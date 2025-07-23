import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const handler = async (req: Request, ctx: unknown) => {
    // Fallback to NextAuth for all requests
    return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };
