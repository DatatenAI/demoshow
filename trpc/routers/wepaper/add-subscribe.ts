import prisma from "@/lib/database";
import {subscribeSchema} from "@/lib/wx-validation";
import {appProtectedProcedure} from "@/trpc/create";


const addSubscribe = appProtectedProcedure
    .input(subscribeSchema)
    .query(async ({input, ctx}) => {
        const {keywordId,openId} = input;
        const existingRecord = await prisma.subscribeKeywords.findFirst({
            where: {
                keywordId: keywordId,
                openId: openId
            },
        });

        if (existingRecord) {
            return {
                message: "keywords already be Subscribe!",
            };
        }
        await prisma.subscribeKeywords.create({
            data: {
                keywordId: keywordId,
                openId: openId
            },
        });
        await prisma.keywords.update({
            where: { id:keywordId },
            data: {
                subNum: {
                    increment: 1,
                },
            },
        });
        return {
            message: "Subscription added successfully",
        };
    });

export default addSubscribe;
