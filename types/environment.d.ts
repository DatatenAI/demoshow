declare namespace NodeJS {
  export interface ProcessEnv {
    readonly MILVUS_ADDRESS:string;
    readonly MILVUS_USER:string;
    readonly MILVUS_PASSWORD:string;

    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_GOOGLE_CLIENT_ID: string;
    readonly NEXTAUTH_GOOGLE_CLIENT_SECRET: string;
    readonly NEXTAUTH_WECHAT_CLIENT_ID: string;
    readonly NEXTAUTH_WECHAT_CLIENT_SECRET: string;

    readonly SMTP_HOST: string;
    readonly SMTP_USER: string;
    readonly SMTP_PASSWORD: string;
    readonly SMTP_PORT: string;
    readonly EMAIL_FROM: string;


    readonly OSS_ENDPOINT: string;
    readonly OSS_BUCKET: string;
    readonly OSS_ACCESS_KEY: string;
    readonly OSS_ACCESS_SECRET: string;
    readonly OSS_VOLUME_PATH?: string;
    readonly ALLINPAY_PRIVATE_KEY: string;
    readonly ALLINPAY_APPID: string;
    readonly ALLINPAY_CUSID: string;

    readonly FUNCTION_ACCESS_KEY_ID: string;
    readonly FUNCTION_ACCESS_KEY_SECRET: string;
    readonly FUNCTION_ENDPOINT: string;

    readonly WX_APPID: string;
    readonly WX_SECRETKEY: string;
    readonly WX_AUTH_SECRETKEY: string;
  }
}
