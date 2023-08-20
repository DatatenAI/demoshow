import {publicProcedure} from "@/trpc";
import {codeSchema} from "@/lib/wx-validation";
import jwt from 'jsonwebtoken';
import prisma from "@/lib/database";


// 生成Token函数
const generateToken = (openid:string) => {
    const secretKey = process.env.WX_AUTH_SECRETKEY
    const payload = {
        openid: openid,
    };
    return jwt.sign(payload, secretKey);
};


const getOpenId = publicProcedure
    .input(codeSchema)
    .query(async ({input, ctx}) => {
        const {code} = input;
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('appid', process.env.WX_APPID);
        params.append('secret', process.env.WX_SECRETKEY);
        params.append('js_code', code);
        const data = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params}`).then(res => res.json());
        data.token = generateToken(data.openid);
        // 将Token返回给前端
        data.wxuser = await prisma.wxUser.findUnique({
            where: {
                openId: data.openid
            }
        });
        return data
    });

export default getOpenId;
