import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface Session {
        user_id: number;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        code: number,
        message: string,
        data: {
            user_id: number;
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        }
    }
}