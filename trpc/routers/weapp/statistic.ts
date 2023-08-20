import prisma from "@/lib/database";
import {openIdSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 统计信息接口
const statistic = appProtectedProcedure
    .input(openIdSchema)
    .query(async ({input, ctx}) => {
        const {openId} = input
        const keywordsSize = await prisma.subscribeKeywords.findMany({
            where: {
                openId: openId
            }
        });
        const favoriteSize = await prisma.favoriteDetails.findMany({
            where: {
                openId: openId
            }
        });
        const likeSize = await prisma.wxLike.findMany({
            where: {
                openId: openId
            }
        });
        const historySize = await prisma.wxHistory.findMany({
            where: {
                openId: openId
            }
        });
        return{
            "keywordsSize":keywordsSize.length,
            "favoriteSize":favoriteSize.length,
            "likeSize":likeSize.length,
            "historySize":historySize.length,
        }
    });

export default statistic;
