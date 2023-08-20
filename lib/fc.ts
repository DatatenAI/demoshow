import  {Config} from '@alicloud/openapi-client';
import FC, {InvokeFunctionHeaders, InvokeFunctionRequest} from '@alicloud/fc-open20210406';
import {RuntimeOptions} from '@alicloud/tea-util';
import logger from "@/lib/logger";

const config = new Config({
    endpoint: process.env.FUNCTION_ENDPOINT,
    accessKeyId: process.env.FUNCTION_ACCESS_KEY_ID,
    accessKeySecret: process.env.FUNCTION_ACCESS_KEY_SECRET,
});

let fc: FC;
const getFc = () => {
    if (fc) {
        return fc;
    } else {
        return new FC(new Config({
            endpoint: process.env.FUNCTION_ENDPOINT,
            accessKeyId: process.env.FUNCTION_ACCESS_KEY_ID,
            accessKeySecret: process.env.FUNCTION_ACCESS_KEY_SECRET,
        }))
    }
}
const invokeFunctionHeaders = new InvokeFunctionHeaders({
    xFcInvocationType: "async",
});
const runtime = new RuntimeOptions({});
export const summary = async (taskId: string) => {
    const params = {
        task_id: taskId,
        user_type: 'user'
    };
    let res: {
        taskId: string,
        success: boolean
    } = {
        taskId,
        success: true
    }
    try {
        if (process.env.NODE_ENV === 'development') {
            const response = await fetch(process.env.FUNCTION_ENDPOINT + `?${new URLSearchParams(params)}`);
            const body = await response.text();
            if (response.status !== 200) {
                logger.error(null, `调用总结失败 code:${response.status},body:${body}`);
                res.success = false;
            }
        } else {
            const response = await getFc().invokeFunctionWithOptions('chatpaper', 'summary-task', new InvokeFunctionRequest({
                body: Buffer.from(JSON.stringify(params)),
                qualifier: 'production',
            }), invokeFunctionHeaders, runtime);
        }
    } catch (e) {
        logger.error(e, "调用总结失败");
        res.success = false;
    }
    return res;


}