import {protectedProcedure} from "@/trpc";
import {SetEmailSchema} from "@/lib/validation";
import {randomBytes} from "crypto";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";
import {VerificationTokenType} from "@prisma/client";
import {sendMail} from "@/lib/mail";
import ApiError from "@/lib/ApiError";

const updateEmail = protectedProcedure
    .input(SetEmailSchema)
    .mutation(async ({input, ctx}) => {
        if (input.email !== ctx.session.user.email) {
            const exists =( await prisma.user.count({where: {email: input.email}})) > 0;
            if (exists) {
                throw new ApiError("邮箱已注册");
            }
            const token = randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + (86400) * 1000);
            await prisma.verificationToken.create({
                data: {
                    identifier: input.email,
                    token: hashToken(token),
                    type: VerificationTokenType.change_email,
                    expires,
                    extra: ctx.session.user.email
                }
            });
            const params = new URLSearchParams({token});
            const link = `${process.env.NEXTAUTH_URL}/verify-email?${params}`;
            try {
                await sendMail("change_email", {
                    to: input.email,
                    subject: "绑定邮箱",
                    params: {
                        link
                    }
                });
                return true;
            } catch (e) {
                throw new ApiError('发送邮件失败');
            }
        } else {
            return false;
        }
    });

export default updateEmail;
