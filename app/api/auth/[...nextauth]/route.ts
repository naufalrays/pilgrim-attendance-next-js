import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Backend_URL } from "@/lib/Constants";

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(Backend_URL + "/auth/refresh", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token.data.refreshToken}`,
    },
  });
  const response = await res.json();

  return response;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;
        const { username, password } = credentials;
        const res = await fetch(Backend_URL + "/auth/login", {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 401) {
          console.log(res.statusText);

          return null;
        }
        const user = await res.json();
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account?.provider == "credentials") {
        return { ...token, ...user };
      }
      if (new Date().getTime() < token.data.expiresIn) {
        return token;
      }
      return await refreshToken(token);
    },

    async session({ token, session }) {
      if (token.data) {
        session.user_id = token.data.user_id;
        session.accessToken = token.data.accessToken;
        session.refreshToken = token.data.refreshToken;
        session.expiresIn = token.data.expiresIn;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
export const GET = handler.handlers.GET;
export const POST = handler.handlers.POST;
