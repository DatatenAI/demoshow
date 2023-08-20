import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {ListTaskSchema} from "@/lib/validation";
import {Prisma} from "@prisma/client";

const list = protectedProcedure
    .input(ListTaskSchema)
    .query(async ({input, ctx}) => {
        const where: Prisma.TaskWhereInput = {
            userId: ctx.session.user.id,
        };
        if (input.state !== 'ALL') {
            where.state = input.state
        }
        const total = await prisma.task.count({
            where,
        })
        let tasks = [];
        if (total) {
            tasks.push(...await prisma.task.findMany({
                where,
                skip: (input.current - 1) * input.size,
                take: input.size,
                orderBy: {
                    createdAt: 'desc',
                }
            }))
        }
        return {
            tasks,
            total,
        };
    });

export default list;
