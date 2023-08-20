import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchSchema} from "@/lib/wx-validation";


const searchInform = publicProcedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
        const {pageNum,pageSize} = input
        const result = await prisma.wxInform.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            orderBy: {
                createTime: 'desc'
            }
        });
        return result;
    });

export default searchInform;
