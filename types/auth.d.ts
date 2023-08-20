import {User} from "next-auth";
import {Prisma} from "@prisma/client";


declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        language: string;
        credits: Prisma.Decimal;
        inviteCode: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: string;
            language: string;
            credits: Prisma.Decimal;
            inviteCode: string;
        },
        wxuser: wxUser & {
            openid: string
        }
    }
}
