import {protectedProcedure} from "@/trpc";
import z from "zod";
import {checkFileExist, getOssClient} from "@/lib/oss";
import {fileTypeFromBuffer, fileTypeFromTokenizer} from "file-type";
import {nanoid} from "nanoid";

export type  HashUrl = {
    hash: string;
    url: string
};
const uploadAvatar = protectedProcedure
    .input(z.string())
    .mutation(async ({input, ctx}) => {
        const ext = input.includes('.') ? input.split('.').pop() : '';
        const filename = ext ? `${nanoid()}.${ext}` : nanoid();
        return await getOssClient().presignedPutObject(process.env.OSS_BUCKET, `avatar/${filename}`, 86400);
    })


export default uploadAvatar;
