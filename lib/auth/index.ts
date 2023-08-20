import "server-only";
import {getServerSession, NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import PrismaAdapter from "./prisma-adapter";
import prisma from "@/lib/database";
import {createHash} from "crypto";
import WechatProvider from "@/lib/auth/wechat-provider";


const googleProvider = GoogleProvider({
    clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true
});
const wechatProvider = WechatProvider({
    clientId: process.env.NEXTAUTH_WECHAT_CLIENT_ID,
    clientSecret: process.env.NEXTAUTH_WECHAT_CLIENT_SECRET,
})

export const credentialProvider = CredentialProvider({
    credentials: {
        email: {
            label: "email",
            type: "text"
        },
        password: {
            label: "password",
            type: "password"
        }
    },
    authorize: async (credentials, req) => {
        if (!credentials) {
            return null;
        }
        const hashedPassword = hashToken(credentials.password);
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
            },
            where: {
                email: credentials.email,
                password: hashedPassword
            }
        });
        if (!user) {
            throw new Error("邮箱或密码错误");
        }
        return user;
    }
});

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        googleProvider,
        credentialProvider,
        wechatProvider
    ],
    pages: {
        signIn: "/sign-in",
        error: "/error"
    },
    session: {
        strategy: "jwt"
    },

    callbacks: {
        async session({
                          token,
                          session
                      }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.language = token.language;
                session.user.credits = token.credits;
                session.user.inviteCode = token.inviteCode;
            }
            return session;
        },
        async jwt({
                      token,
                      user
                  }) {
            const dbUser = token.id ? await prisma.user.findFirst({
                where: {
                    id: token.id
                }
            }) : null;

            if (!dbUser) {
                if (user) {
                    token.id = user?.id;
                }
                return token;
            }
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                language: dbUser.language,
                credits: dbUser.credits,
                inviteCode: dbUser.inviteCode
            };
        },
        async redirect(params) {
            return params.url;
        }
    },
};

export const hashToken = (token: string, secret?: string) => {
    return (
        createHash("sha256")
            .update(`${token}${secret || process.env.NEXTAUTH_SECRET}`)
            .digest("hex")
    );
};

export const getSession = async () => {
    return getServerSession(authOptions);
};
export const getCurrentUser = async () => {
    const serverSession = await getSession();
    if (serverSession) {
        const user = {...serverSession.user};
        if (user.email?.endsWith("@wechat.com")) {
            user.email = "未设置邮箱";
        }
        return user;
    }
    return null;
};
export const getCurrentUserId: () => Promise<string | undefined> = async () => {
    const user = await getCurrentUser();
    return user?.id;
};