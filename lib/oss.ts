import {Client} from "minio";
import {fileTypeFromBuffer} from "file-type";
import {pdfMd5, streamToUint8Array, toBuffer} from "@/lib/common";
import fs from "fs/promises";
import path from "path";
import contentDisposition from "content-disposition";

let ossClient: Client;
export const getOssClient = () => {
    if (ossClient) {
        return ossClient;
    } else {
        ossClient = new Client({
            endPoint: process.env.OSS_ENDPOINT,
            accessKey: process.env.OSS_ACCESS_KEY,
            secretKey: process.env.OSS_ACCESS_SECRET,
            pathStyle: false,
        });
        return ossClient;
    }
}

export const getFileUrl = (folder: string, object: string) => {
    return `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT}/${folder}/${object}`
}

export const checkFileExist = async (folder: string, object: string) => {
    if (process.env.OSS_VOLUME_PATH) {
        return await fs.access(path.resolve(process.env.OSS_VOLUME_PATH, folder, object)).then(() => true).catch(() => false);
    } else {
        try {
            await ossClient.statObject(process.env.OSS_BUCKET, folder + "/" + object);
        } catch (e) {
            // @ts-ignore
            if (e?.code === 'NotFound') {
                return false;
            }
            throw e;
        }
    }
}
export const uploadRemotePDF = async (url: string, folder: string = "") => {
    const fetchRes = await fetch(url);
    const dispositionHeader = fetchRes.headers.get("Content-Disposition");
    let fileName: string | null = null;
    if (dispositionHeader) {
        const parseInfo = contentDisposition.parse(dispositionHeader);
        fileName = parseInfo.parameters.filename;
    }
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = toBuffer(arrayBuffer);
    const fileType = await fileTypeFromBuffer(buffer);
    const hash = await pdfMd5(arrayBuffer);
    const objectName = `${hash}.${fileType?.ext}`;
    if (!fileName) {
        fileName = objectName;
    }
    if (!await checkFileExist(folder, "")) {
        await fs.mkdir(folder, {recursive: true})
    }
    let existed = await checkFileExist(folder, objectName);
    if (!existed) {

        if (process.env.OSS_VOLUME_PATH) {
            await fs.writeFile(path.resolve(process.env.OSS_VOLUME_PATH, folder, objectName), buffer);
        } else {
            await ossClient.putObject(process.env.OSS_BUCKET, `${folder}/${objectName}`, buffer, {
                'Content-Type': fileType?.mime
            });
        }
    }
    return {
        originUrl: url,
        url: getFileUrl(folder, objectName),
        hash,
        fileName,
        mime: fileType?.mime
    };
}

export const readFile = async (folder: string, object: string) => {
    if (process.env.OSS_VOLUME_PATH) {
        const buffer = await fs.readFile(path.resolve(process.env.OSS_VOLUME_PATH, folder, object));
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length);
    } else {
        return (await streamToUint8Array(await ossClient.getObject(process.env.OSS_BUCKET, folder + "/" + object))).buffer;
    }
}

