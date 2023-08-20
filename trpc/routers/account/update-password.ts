import {protectedProcedure} from "@/trpc";
import {UpdatePasswordSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";
import {Prisma} from "@prisma/client";
import ApiError from "@/lib/ApiError";

const updatePassword = protectedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        try {
            await prisma.user.update({
                where: {
                    id: userId,
                    password: hashToken(input.current),
                },
                data: {
                    password: hashToken(input.newPassword),
                },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new ApiError('当前密码输入不正确');
                }
            }
            throw e;
        }
    });

export default updatePassword;
