
import prisma from "@/lib/database";
import {searchSummarySchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


const searchSummaryHistory = appProtectedProcedure
    .input(searchSummarySchema)
    .query(async ({input, ctx}) => {
        const { pageNum,pageSize,email } = input;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (user == null) {
            return [];
        }
        return await prisma.task.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                userId: user.id
            },
            include: {
                summary: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    });

export default searchSummaryHistory;
