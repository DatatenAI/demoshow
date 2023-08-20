import SparkMD5 from "spark-md5";
import * as PdfDist from "pdfjs-dist";
import {TextItem} from "pdfjs-dist/types/src/display/api";
import * as Comlink from "comlink";
// @ts-ignore
import PdfWorker from "pdfjs-dist/build/pdf.worker.entry";

PdfDist.GlobalWorkerOptions.workerPort = PdfWorker;

const worker: { calc: (file: File) => Promise<string> } = {
    calc: (file: File) => {
        return new Promise((resolve, reject) => {
            const spark = new SparkMD5();
            const fileReader = new FileReader();
            fileReader.onload = function () {
                PdfDist.getDocument({
                    data: this.result as ArrayBuffer,
                }).promise.then(async pdf => {
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const tokenizedText = await page.getTextContent();
                        const strings = tokenizedText.items.map(item => (item as TextItem).str);
                        spark.append(strings.join());
                    }
                    resolve(spark.end());
                });
            }
            fileReader.readAsArrayBuffer(file);
        })
    }
}
Comlink.expose(worker);

export default worker;