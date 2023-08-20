import {OAuthConfig, OAuthUserConfig} from "next-auth/providers";
import {Awaitable, TokenSet, User} from "next-auth";

export interface WechatProfile extends Record<string, any> {
    openid: string;
    nickname: string;
    sex: string;
    province: string;
    city: string;
    country: string;
    headimgurl: string;
    unionid: string;
}

const WechatProvider = (
    options: OAuthUserConfig<WechatProfile>
): OAuthConfig<WechatProfile> => {
    return {
        profile<P>(profile: WechatProfile, tokens: TokenSet): Awaitable<User> {
            return {
                id: profile.openid,
                name: profile.nickname,
                email: profile.openid + "@wechat.com",
                image: profile.headimgurl,
            };
        },
        id: "wechat",
        name: "Wechat",
        type: "oauth",
        authorization: {
            url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
            params: {
                scope: 'snsapi_userinfo',
                appid: options.clientId
            }
        },
        token: "https://api.weixin.qq.com/sns/oauth2/access_token",
        userinfo: "https://api.weixin.qq.com/sns/userinfo",
        issuer: "https://open.weixin.qq.com",
        style: {
            logo: "/google.svg",
            logoDark: "/google.svg",
            bgDark: "#fff",
            bg: "#fff",
            text: "#000",
            textDark: "#000",
        },
        options,
    };
};
export default WechatProvider;
