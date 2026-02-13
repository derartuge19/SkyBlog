import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        console.log("Middleware triggered:", req.nextUrl.pathname);
        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/skyadmin/login',
        },
    }
);



export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
