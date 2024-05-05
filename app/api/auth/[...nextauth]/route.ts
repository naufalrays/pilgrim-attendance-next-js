import authOptions from "../../../../lib/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
export const GET = handler.handlers.GET;
export const POST = handler.handlers.POST;
