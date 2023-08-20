import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {CreditType, Prisma} from "@prisma/client";
import dayjs from "dayjs";
import ApiError from "@/lib/ApiError";

const checkIn = protectedProcedure
    .mutation(async ({
                         input,
                         ctx
                     }) => {
        const checked = (await prisma.creditHistory.count({
                where: {
                    userId: ctx.session.user.id,
                    type: CreditType.CHECK_IN,
                    happenedAt: {
                        gte: dayjs().startOf('day').toDate(),
                    }
                }
            })
        ) > 0;
        if (checked) {
            throw new ApiError("今天已签到");
        }
        const checkInCredits = new Prisma.Decimal(32)
        await prisma.$transaction([prisma.creditHistory.create({
            data: {
                userId: ctx.session.user.id,
                type: CreditType.CHECK_IN,
                amount: checkInCredits,
            }
        }),
            prisma.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    credits: {
                        increment: checkInCredits
                    }
                }
            })]);
        return checkInCredits;
    });

export default checkIn;