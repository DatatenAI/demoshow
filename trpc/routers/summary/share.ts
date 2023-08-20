import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import ApiError from "@/lib/ApiError";
import z from "zod";

const Share = protectedProcedure
    .input(z.bigint())
    .mutation(async ({
                         input,
                         ctx
                     }) => {
        let share = await prisma.shareHistory.findUnique({
            where: {
                summaryId_userId: {
                    summaryId: input,
                    userId: ctx.session.user.id
                },
            }
        });
        if (share) {
            return share.id;
        }

        const summary = await prisma.summary.findUnique({
            where: {
                id: input,
            }
        });
        if (summary) {
            share = await prisma.shareHistory.create({
                data: {
                    summaryId: summary.id,
                    userId: ctx.session.user.id
                }
            });
            return share.id;
        } else {
            throw new ApiError("总结不存在");
        }
    });


export default Share;
