import {protectedProcedure} from "@/trpc";
import {SetPasswordSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {hashToken} from "@/lib/auth";

const setPassword = protectedProcedure
    .input(SetPasswordSchema)
    .mutation(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashToken(input.newPassword),
            },
        });
    });

export default setPassword;
