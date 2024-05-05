import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Backend_URL } from "@/lib/Constants";
import authOptions from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
