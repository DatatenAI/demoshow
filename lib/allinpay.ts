import crypto from "crypto";

const ALLINPAY_PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCm9OV6zH5DYH/ZnAVYHscEELdCNfNTHGuBv1nYYEY9FrOzE0/4kLl9f7Y9dkWHlc2ocDwbrFSm0Vqz0q2rJPxXUYBCQl5yW3jzuKSXif7q1yOwkFVtJXvuhf5WRy+1X5FOFoMvS7538No0RpnLzmNi3ktmiqmhpcY/1pmt20FHQQIDAQAB
-----END PUBLIC KEY-----
`

const sortParams = (params: { [key: string]: any }) => {
    return Object.keys(params).sort().map(
        (key) => {
            return `${key}=${params[key]}`
        }
    ).join("&");
}
export const sign = (params: { [key: string]: any }) => {
    const sortedParamsStr = sortParams(params);
    const sign = crypto.createSign('SHA1');
    sign.update(sortedParamsStr, 'utf-8');
    return sign.sign(process.env.ALLINPAY_PRIVATE_KEY.replace(/\\n/g, '\n'), 'base64')
}
export const verifySign = (params: { [key: string]: string }, sign: string) => {
    const sortedParamsStr = sortParams(params);
    const verifier = crypto.createVerify('SHA1');
    verifier.update(sortedParamsStr, 'utf-8');
    return verifier.verify(ALLINPAY_PUBLIC_KEY, sign, 'base64');
}