import {publicProcedure} from "@/trpc";
import {searchPaperDetail} from "@/lib/wx-validation";
import prisma from "@/lib/database";



// 生成Token函数


const getQrcode = publicProcedure
    .input(searchPaperDetail)
    .query(async ({input, ctx}) => {
        const {paperId, openId} = input;
        const detail = await prisma.paperInfo.findUnique({
            where: {
                id: paperId
            },
            include: {
                summary: true,
            }
        });
        const wxuser = await prisma.wxUser.findUnique({
            where: {
                openId: openId
            }
        });
        const history = await prisma.wxHistory.findMany({
            where: {
                openId: openId
            },
        });
        const token = await getAccessToken();
        return {
            "history": history.length,
            "detail": detail,
            "wxuser": wxuser,
            "qrcode": await fetchQRCode(token,paperId)
        }
    });


let accessToken: string | undefined;
let tokenExpirationTime: number | undefined;

// 请求微信访问令牌
async function requestAccessToken(): Promise<void> {
    try {
        // 发起获取访问令牌的请求，获取新的令牌和过期时间
        const {token, expiresIn} = await fetchAccessToken();
        // 保存令牌和过期时间
        accessToken = token;
        tokenExpirationTime = Date.now() + (expiresIn - 100) * 1000; // 将过期时间转换为毫秒并添加到当前时间
    } catch (error) {
        console.error('Error requesting access token:', error);
        // 处理错误情况
    }
}

// 获取微信访问令牌
async function getAccessToken(){
    // 检查令牌是否存在且未过期
    if (accessToken && tokenExpirationTime && tokenExpirationTime > Date.now()) {
        return accessToken;
    }
    // 令牌不存在或已过期，重新请求获取
    await requestAccessToken();
    return accessToken || '';
}



// 示例请求获取微信访问令牌的函数（需自行实现）
async function fetchAccessToken(): Promise<{ token: string; expiresIn: number }> {
    let appid = process.env.WX_APPID; //自己小程序后台管理的appid，可登录小程序后台查看
    let secret = process.env.WX_SECRETKEY; //小程序后台管理的secret，可登录小程序后台查看
    const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?';
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credential');
    tokenParams.append('appid', appid);
    tokenParams.append('secret', secret);
    const result = await fetch(tokenUrl + tokenParams, {method: 'GET'}).then(response => response.json())
    return {
        'token': result.access_token,
        'expiresIn': result.expires_in
    };
}

// 示例请求微信接口获取二维码的函数（需自行实现）
async function fetchQRCode(accessToken: string, paperId:number): Promise<string> {
    // 发起请求获取二维码
    // ...
    const codeUrl = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=';
    const codeParams = JSON.stringify({
        path: 'pages/home/detail/detail?id='+paperId,
        width: 360,
        auto_color: true,
        env_version: 'release'
    });
    const qrcode = await fetch(codeUrl + accessToken, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: codeParams
    }).then(response => response.arrayBuffer());
    const byteArray: Uint8Array = new Uint8Array(qrcode);
    const buffer = Buffer.from(byteArray);
    return buffer.toString('base64');
}


export default getQrcode;
