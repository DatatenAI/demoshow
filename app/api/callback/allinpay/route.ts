import {Api} from "@/types";
import logger from "@/lib/logger";
import {verifySign} from "@/lib/allinpay";
import prisma from "@/lib/database";
import {CreditPayStatus, CreditType} from "@prisma/client";


export const POST: Api = async (req) => {
    try {
        const {sign, ...params} = Object.fromEntries(new URLSearchParams(await req.text()));
        const payNo = params["outtrxid"];
        const payFee = parseInt(params["trxamt"]);
        logger.info(params, "支付回调");
        if (verifySign(params, sign)) {
            const payHistory = await prisma.creditPayHistory.findUnique({
                where: {
                    payNo
                },
                include: {
                    good: true
                }
            });
            if (payHistory) {
                if (payHistory.fee.eq(process.env.NODE_ENV === 'development' ? payHistory.fee : payFee) && payHistory.status === CreditPayStatus.PAYING) {
                    const userId = payHistory.userId;
                    const credits = payHistory.good.credits;
                    await prisma.$transaction([prisma.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            credits: {
                                increment: credits
                            }
                        }
                    }), prisma.creditHistory.create({
                        data: {
                            userId,
                            type: CreditType.PURCHASE,
                            amount: credits,
                        }
                    }), prisma.creditPayHistory.update({
                        where: {id: payHistory.id},
                        data: {
                            status: CreditPayStatus.SUCCESS,
                            finishedAt: new Date(),
                        }
                    })]);
                }
            }
        } else {
            logger.error(params, "通联回调签名失败");
        }
        return new Response("success");
    } catch (e) {
        logger.error(e, "处理支付回调失败")
    }
    return new Response('failed', {status: 500});
}
