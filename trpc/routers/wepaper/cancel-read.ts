import prisma from "@/lib/database";
import {addReadSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


/// 取消待阅
const cancelRead = appProtectedProcedure
    .input(addReadSchema)
    .query(async ({input, ctx}) => {
        const {userId,openId,paperId} = input;
        await prisma.wxWaitRead.delete({
            where: {
                openId_paperId: {
                    openId: openId,
                    paperId: paperId
                }
            },
        });
        return {
            message: "read cancel successfully",
        };
    });

export default cancelRead;
