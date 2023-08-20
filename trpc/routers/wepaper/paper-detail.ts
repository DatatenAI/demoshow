import prisma from "@/lib/database";
import {searchPaperDetail} from "@/lib/wx-validation";
import {addWxHistory} from '@/trpc/routers/wxhistory/add-history';
import {appPublicProcedure} from "@/trpc/create";



const paperDetail = appPublicProcedure
    .input(searchPaperDetail)
    .query(async ({input, ctx}) => {
        const { paperId} = input
        const detail = await prisma.paperInfo.findUnique({
            where: {
                id: paperId
            },
            include: {
                summary: true,
            }
        });
        const extendedPaper: prisma.paperInfo & {
            likeFlag: boolean;
            favoriteFlag: boolean;
        } | null = detail ? { ...detail, likeFlag: false, favoriteFlag: false } : null;
        //查询是否被收藏或者点赞
        if (ctx.session != null && ctx.session.wxuser != null) {
            // 添加浏览历史
            await addWxHistory(ctx.session.wxuser.openid, paperId)
            const wxLike = await prisma.wxLike.findMany({
                where: {
                    openId: ctx.session.wxuser.openid,
                    paperId: paperId
                }
            })
            const favorite = await prisma.favoriteDetails.findMany({
                where: {
                    openId: ctx.session.wxuser.openid,
                    paperId: paperId
                }
            })
            if (wxLike.length > 0) extendedPaper.likeFlag = true
            if (favorite.length > 0) extendedPaper.favoriteFlag = true
        }
        return extendedPaper;
    });

export default paperDetail;
