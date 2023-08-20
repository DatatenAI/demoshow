import {protectedProcedure} from "@/trpc";
import z from "zod";
import prisma from "@/lib/database";
import ApiError from "@/lib/ApiError";
import {CreditType} from "@prisma/client";
import {ExchangeSchema} from "@/lib/validation";


const recharge = protectedProcedure
    .input(ExchangeSchema)
    .mutation(async ({input, ctx}) => {
        const key = await prisma.creditKey.findUnique({
            where: {
                key: input.key,
                used: false,
            }
        });
        if (!key) {
            throw new ApiError("兑换码不存在");
        }
        await prisma.$transaction(async trx => {
            await trx.creditKey.update({
                where: {
                    key: input.key
                },
                data: {
                    used: true,
                    usedAt: new Date(),
                }
            });
            await trx.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    credits: {
                        increment: key.amount,
                    }
                }
            });
            await trx.creditHistory.create({
                data: {
                    userId: ctx.session.user.id,
                    amount: key.amount,
                    type: CreditType.EXCHANGE
                }
            });
        });
        return key.amount;
    });

export default recharge;
