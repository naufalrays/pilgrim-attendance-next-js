import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Backend_URL } from "./Constants";
import { JWT } from "next-auth/jwt";

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

const authOptions: NextAuthOptions = {
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

export default authOptions;
