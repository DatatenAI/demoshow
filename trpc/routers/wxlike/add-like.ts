
import prisma from "@/lib/database";
import {addLikeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";



/// 点赞
const addLike = appProtectedProcedure
    .input(addLikeSchema)
    .query(async ({input, ctx}) => {
        const {openId,paperId} = input;
        await prisma.wxLike.create({
            data: {
                openId: openId,
                paperId: paperId,
                createTime: new Date()
            }
        })
        return {
            message: "like added successfully",
        };
    });

export default addLike;
