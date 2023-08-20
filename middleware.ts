import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export default withAuth(
    async function middleware(req) {
        const token = await getToken({req});
        const authed = !!token;
        const ignoreAuth =
            req.nextUrl.pathname.startsWith("/sign-in") ||
            req.nextUrl.pathname.startsWith("/sign-up")
        if (ignoreAuth) {
            if (authed) {
                return NextResponse.redirect(new URL("/home", req.url))
            }
            const searchParams = new URL(req.url).searchParams;
            const inviteCode = searchParams.get("inviteCode");
            const res = NextResponse.next();
            if (inviteCode) {
                res.cookies.set("inviteCode", inviteCode);
            }
            return res;
        }
        if (!authed) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }
            return NextResponse.redirect(
                new URL(`/sign-in?callbackUrl=${encodeURIComponent(from)}`, req.url)
            );
        }
    },
    {
        callbacks: {
            async authorized() {
                return true;
            }
        }
    }
);
// @ts-ignore
export const config = {
    matcher: ["/((?!404|error|api|reset-password|verify-email|share).*)"]
};