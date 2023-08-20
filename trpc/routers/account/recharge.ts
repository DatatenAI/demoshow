import {protectedProcedure} from "@/trpc";
import {customAlphabet} from "nanoid";
import ApiError from "@/lib/ApiError";
import {RechargeSchema} from "@/lib/validation";
import {PayMethodEnum} from "@/lib/constants";
import prisma from "@/lib/database";
import {CreditPayStatus} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import dayjs from "dayjs";
import {sign} from "@/lib/allinpay";


const payMethodCodes: Record<PayMethodEnum, string> = {
    ALIPAY: 'A01',
    WEPAY: 'W01'
}

const nanoid = customAlphabet('1234567890', 10)
const genPayNo = () => {
    const timestamp = dayjs().format("YYYYMMDDHHmmSSS"); // 获取当前时间戳
    const formattedSequence = String(nanoid(10)).padStart(4, '0');
    return `${timestamp}${formattedSequence}`;
}

const recharge = protectedProcedure
    .input(RechargeSchema)
    .mutation(async ({input, ctx}) => {
        const good = await prisma.creditGood.findUnique({
            where: {
                id: input.goodId
            }
        });
        if (!good) {
            throw new TRPCError({code: "NOT_FOUND", message: '套餐不存在'})
        }
        const payNo = genPayNo();
        const params: Record<string, any> = {
            cusid: process.env.ALLINPAY_CUSID,
            appid: process.env.ALLINPAY_APPID,
            version: 11,
            trxamt: process.env.NODE_ENV === 'development' ? 1 : good.price,
            paytype: payMethodCodes[input.method],
            reqsn: payNo,
            randomstr: nanoid(6),
            body: '充值点数',
            notify_url: process.env.NEXTAUTH_URL + '/api/callback/allinpay',
            signtype: 'RSA',
        };
        params.sign = sign(params);
        const res = await fetch('https://vsp.allinpay.com/apiweb/unitorder/pay', {
            method: 'POST',
            body: new URLSearchParams(params),
        }).then(res => res.json());
        if (res.retcode === "SUCCESS") {
            await prisma.creditPayHistory.create({
                data: {
                    goodId: input.goodId,
                    userId: ctx.session.user.id,
                    credits:good.credits,
                    payNo,
                    fee: good.price,
                    status: CreditPayStatus.PAYING,
                }
            });
            return {
                url: res.payinfo as string,
                payNo
            };
        }
        throw new ApiError("发起支付失败");
    });

export default recharge;
