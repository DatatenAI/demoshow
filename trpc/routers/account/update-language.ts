import {protectedProcedure} from "@/trpc";
import {UpdateLanguageSchema} from "@/lib/validation";
import prisma from "@/lib/database";

const updatePassword = protectedProcedure
    .input(UpdateLanguageSchema)
    .mutation(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        await prisma.user.update({
            where: {
                id: userId,

            },
            data: {
                language: input.language,
            }
        });
    });

export default updatePassword;
