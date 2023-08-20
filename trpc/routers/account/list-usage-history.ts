import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {ListUsageHistorySchema} from "@/lib/validation";
import {Prisma} from "@prisma/client";

const listUsageHistory = protectedProcedure
    .input(ListUsageHistorySchema)
    .query(async ({input, ctx}) => {
        const where: Prisma.CreditHistoryWhereInput = {
            userId: ctx.session.user.id,
        };

        const total = await prisma.creditHistory.count({
            where,
        })
        let histories = [];
        if (total) {
            histories.push(...await prisma.creditHistory.findMany({
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

export default listUsageHistory;
