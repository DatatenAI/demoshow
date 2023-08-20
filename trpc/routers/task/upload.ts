import {protectedProcedure} from "@/trpc";
import z from "zod";
import {checkFileExist, getOssClient} from "@/lib/oss";

export type  HashUrl = {
    hash: string;
    url: string
};
const upload = protectedProcedure
    .input(z.set(z.string()).max(10, "一次最多上传10个PDF"))
    .mutation(async ({input, ctx}) => {
        const hashUrls: (HashUrl | null)[] = await Promise.all(Array.from(input).map(async hash => {
            const objectName = `${hash}.pdf`;
            const exist = await checkFileExist("uploads", objectName);
            if (exist) {
                return null;
            }
            return {
                hash,
                url: await getOssClient().presignedPutObject(process.env.OSS_BUCKET, `uploads/${objectName}`, 86400)
            };
        }));
        return hashUrls.filter(it => it !== null) as HashUrl[];
    })


export default upload;
