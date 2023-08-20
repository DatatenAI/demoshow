import {publicProcedure} from "@/trpc";
import {SendMailSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";
import {randomBytes} from "crypto";
import {VerificationTokenType} from "@prisma/client";
import {sendMail} from "@/lib/mail";
import ApiError from "@/lib/ApiError";

const resetPassword = publicProcedure
    .input(SendMailSchema)
    .mutation(async ({
                         input,
                         ctx
                     }) => {
        const {email} = input;
        const user = await prisma.user.findUnique({
            where: {
                email,
                emailVerified: {
                    not: null,
                },
            }
        });
        if (user) {
            const token = randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + (86400) * 1000);
            await prisma.verificationToken.create({
                data: {
                    identifier: input.email,
                    token: hashToken(token),
                    type: VerificationTokenType.reset_password,
                    expires
                }
            });
            const params = new URLSearchParams({token});
            const link = `${process.env.NEXTAUTH_URL}/reset-password/confirm?${params}`;
            try {
                await sendMail("reset_password", {
                    to: email,
                    subject: "重置密码",
                    params: {
                        link
                    }
                });
            } catch (e) {
                throw new ApiError('发送邮件失败');
            }
        }
        return {
            message: "邮件已发送"
        };
    });

export default resetPassword;