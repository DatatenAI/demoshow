import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import z from "zod";
import {CreditPayStatus} from "@prisma/client";

const checkPayResult = protectedProcedure
    .input(z.string().nullish())
    .query(async ({input, ctx}) => {
        if (!input) {
            return CreditPayStatus.PAYING;
        }
        const payHistory = await prisma.creditPayHistory.findUnique({
            select: {
                status: true
            },
            where: {
                payNo: input,
            }
        });
        return payHistory?.status || CreditPayStatus.PAYING;
    });

export default checkPayResult;