import prisma from "@/lib/database";
import {searchSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 获取用户所有收藏文章
const scarchFavoritePaper = appProtectedProcedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
        let { openId,favoriteId,pageNum,pageSize } = input;
        return await prisma.favoriteDetails.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                ...(favoriteId && { favoriteId }),
                openId: openId
            },
            include: {
                paperInfo: true
            },
            orderBy: {
                createTime: 'desc',
            },
        });
    });

export default scarchFavoritePaper;
