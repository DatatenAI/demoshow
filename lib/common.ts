import crypto, {BinaryLike} from "crypto";
import * as PDF from "pdfjs-dist";
import {TextItem} from "pdfjs-dist/types/src/display/api";
import ReadableStream = NodeJS.ReadableStream;
export const toBuffer = (arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

export const md5: (data: BinaryLike) => string = (data) => {
    return crypto.createHash('md5').update(data).digest('hex')
}

export const pdfMd5: (data: ArrayBuffer) => Promise<string> = async (data) => {
    const doc = await PDF.getDocument(data).promise;
    const hash = crypto.createHash('md5');
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const tokenizedText = await page.getTextContent();
        hash.update(tokenizedText.items.map(item => (item as TextItem).str).join(""));
    }
    await doc.destroy();
    return hash.digest('hex');
}

export const streamToBuffer = (stream: ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
};


export const streamToUint8Array = async (stream: ReadableStream) => {
    const chunks: any[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return new Uint8Array(Buffer.concat(chunks));
}
