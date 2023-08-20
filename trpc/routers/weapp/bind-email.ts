import {bindEmailSchema} from "@/lib/wx-validation";
import {TRPCError} from "@trpc/server";
import prisma from "@/lib/database";
import {publicProcedure} from "@/trpc/create";


const bindEmail = publicProcedure
    .input(bindEmailSchema)
    .query(async ({input, ctx}) => {
        const {openId,email,code} = input;
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: code
            }
        });
        if (!verificationToken) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "验证链接已过期"
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (user == null ) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "邮箱绑定失败，没有关联到平台用户"
            });
        }
        await prisma.wxUser.update({
            where: {
                openId: openId
            },
            data: {
                email: email
            }
        });
        return {
            message: "email bind success"
        };
    });

export default bindEmail;
