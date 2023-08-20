import {publicProcedure} from "@/trpc";
import {ResetPasswordConfirmSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";
import {TRPCError} from "@trpc/server";
import ApiError from "@/lib/ApiError";

const resetPassword = publicProcedure
    .input(ResetPasswordConfirmSchema)
    .mutation(async ({input, ctx}) => {
        const {token, newPassword, confirmPassword} = input;
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: hashToken(token)
            }
        });
        if (!verificationToken) {
            throw new ApiError('验证链接已过期');
        }
        await prisma.user.update({
            where: {
                email: verificationToken.identifier
            },
            data: {
                password: hashToken(input.newPassword)
            }
        });

        return {
            message: "密码已重置"
        };
    });

export default resetPassword;