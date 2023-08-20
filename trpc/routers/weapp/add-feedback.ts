import prisma from "@/lib/database";
import {addFeedBackSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


const addFeedback = appProtectedProcedure
    .input(addFeedBackSchema)
    .mutation(async ({input, ctx}) => {
        const {openId,type,content} = input
        await prisma.wxFeedback.create({
            data: {
                openId: openId,
                type: type,
                content: content,
                createTime: new Date()
            }
        });
        return {
            message: "feedback added successfully",
        };
    });

export default addFeedback;
