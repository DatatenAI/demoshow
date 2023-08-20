import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";

const deleteAccount = protectedProcedure
    .query(async ({input, ctx}) => {
        const userId = ctx.session.user.id;
        await prisma.$transaction(async trx => {
            await prisma.account.deleteMany({
                where: {
                    userId
                }
            });
        })
    });

export default deleteAccount;