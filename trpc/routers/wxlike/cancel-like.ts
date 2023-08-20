
import prisma from "@/lib/database";
import {addLikeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 取消点赞
const cancelLike = appProtectedProcedure
    .input(addLikeSchema)
    .query(async ({input, ctx}) => {
        const {openId,paperId} = input;
        await prisma.wxLike.delete({
            where: {
                openId_paperId: {
                    openId: openId,
                    paperId: paperId
                }
            },
        })
        return {
            message: "like cancel successfully",
        };
    });

export default cancelLike;
