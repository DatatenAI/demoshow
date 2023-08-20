import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {ListPayHistorySchema} from "@/lib/validation";
import {Prisma} from "@prisma/client";

const listPayHistory = protectedProcedure
    .input(ListPayHistorySchema)
    .query(async ({input, ctx}) => {
        const where: Prisma.CreditPayHistoryWhereInput = {
            userId: ctx.session.user.id,
        };

        const total = await prisma.creditPayHistory.count({
            where,
        })
        let histories = [];
        if (total) {
            histories.push(...await prisma.creditPayHistory.findMany({
                where,
                skip: (input.current - 1) * input.size,
                take: input.size,
                orderBy: {
                    id: 'desc',
                }
            }))
        }
        return {
            histories,
            total,
        };
    });

export default listPayHistory;
