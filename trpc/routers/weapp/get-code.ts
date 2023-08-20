import {bindEmailSchema} from "@/lib/wx-validation";
import {sendMail} from "@/lib/mail";
import {TRPCError} from "@trpc/server";
import prisma from "@/lib/database";
import {VerificationTokenType} from "@prisma/client";
import {appProtectedProcedure} from "@/trpc/create";

const getCode = appProtectedProcedure
    .input(bindEmailSchema)
    .query(async ({input, ctx}) => {
        try {
            const {email} = input;
            const expires = new Date(Date.now() + (86400) * 1000);
            const code = Math.floor(100000 + Math.random() * 900000).toString()
            await prisma.verificationToken.create({
                data: {
                    identifier: email,
                    token: code,
                    type: VerificationTokenType.bind_email,
                    expires
                }
            });
            const link = code
            await sendMail("bind_email", {
                to: email,
                subject: "绑定邮箱验证码",
                params:{
                    link
                }
            });
        }catch (e) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "发送邮件失败，请重试",
                cause: e
            });
        }
        return {
            message: "邮件已发送"
        };
    });

export default getCode;
