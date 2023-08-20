import prisma from "@/lib/database";
import {insertFavoriteSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 添加收藏
const addFavoritePaper = appProtectedProcedure
    .input(insertFavoriteSchema)
    .mutation(async ({input, ctx}) => {
        const {openId,favoriteId,paperId,source} = input;
        await prisma.favoriteDetails.create({
            data: {
                openId: openId,
                favoriteId: favoriteId,
                paperId: paperId,
                source: source,
                createTime: new Date()
            }
        })
        return {
            message: "Favorite added successfully",
        };
    });

export default addFavoritePaper;
