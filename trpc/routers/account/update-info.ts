import {protectedProcedure} from "@/trpc";
import {UpdateInfoSchema} from "@/lib/validation";
import prisma from "@/lib/database";

const updateInfo = protectedProcedure
    .input(UpdateInfoSchema)
    .mutation(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: input.name,
                image: input.avatar
            },
        });
    });

export default updateInfo;
