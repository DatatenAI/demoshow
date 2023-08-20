import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 取消收藏
const cancelFavorite = appProtectedProcedure
    .input(insertFavoriteSchema)
    .query(async ({input, ctx}) => {
        const {openId,paperId} = input;
        await prisma.favoriteDetails.delete({
            where: {
                openId_paperId: {
                    openId: openId,
                    paperId: paperId
                }
            },
        })
        return {
            message: "Favorite delete successfully",
        };
    });

export default cancelFavorite;
