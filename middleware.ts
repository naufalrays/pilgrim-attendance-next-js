// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/",
        "/user/:path*",
        "/trip/:path*",
        "/announcement/:path*",
        "/report/:path*",
        "/backup",
    ],
};
