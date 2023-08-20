import {protectedProcedure} from "@/trpc";
import {CreateTaskSchema} from "@/lib/validation";
import prisma from "@/lib/database";
import {CreditType, Prisma, TaskState, TaskType} from "@prisma/client";
import ApiError from "@/lib/ApiError";
import {readFile, uploadRemotePDF} from "@/lib/oss";
import * as PDF from "pdfjs-dist";
import {summary} from "@/lib/fc";
import {nanoid} from "nanoid";
/**
 * 计算任务消耗credits
 * @param pdfHash 获取pdf页数
 */
const getPdfPages = async (pdfHash: string) => {
    let src = await readFile("uploads", `${pdfHash}.pdf`);
    const doc = await PDF.getDocument(src).promise;
    console.log(11111,doc.numPages)
    return doc.numPages
};

const create = protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({
                         input,
                         ctx
                     }) => {
        const pdfs: typeof input.pdfFiles = [];
        if (input.pdfFiles?.length) {
            pdfs.push(...input.pdfFiles);
        } else {
            if (input.pdfUrls?.length) {
                const uploadFiles = await Promise.all(
                    input.pdfUrls.map((url) => {
                        return uploadRemotePDF(url, "uploads");
                    })
                ).catch(error => {
                    ctx.logger.error(error, "下载文件失败");
                    throw new ApiError("下载文件失败，请检查链接是否正确");
                });
                for (let uploadFile of uploadFiles) {
                    console.log(uploadFile)
                    if (uploadFile.mime !== 'application/pdf') {
                        const idx = input.pdfUrls.findIndex(it => it === uploadFile.originUrl);
                        throw new ApiError(`第${idx + 1}行链接不是PDF文件`);
                    }
                    if (pdfs.findIndex(pdf => pdf.hash === uploadFile.hash) < 0) {
                        pdfs.push({
                            fileName: uploadFile.fileName,
                            hash: uploadFile.hash
                        });
                    }
                }
            }
        }
        if (!pdfs.length) {
            throw new ApiError("PDF文件不能为空");
        }
        const allSameTasks = await prisma.task.findMany({
            where: {
                pdfHash: {
                    in: pdfs.map(pdf => pdf.hash),
                },
                state: TaskState.SUCCESS,
            },
        });
        const tasks = await Promise.all(pdfs.map(async (pdf) => {
            let taskType: TaskType;
            const sameHashTasks = allSameTasks.filter((task) => task.pdfHash === pdf.hash)
            const hasSameLanguageTask = sameHashTasks.findIndex(task => task.language === input.language) >= 0;
            if (sameHashTasks.length) {
                taskType = TaskType.TRANSLATE;
            } else {
                taskType = TaskType.SUMMARY;
            }

            const pages = await getPdfPages(pdf.hash);
            return {
                id: nanoid(),
                type: taskType,
                userId: ctx.session.user.id,
                language: input.language,
                pdfHash: pdf.hash,
                fileName: pdf.fileName,
                pages,
                costCredits: pages * (taskType === TaskType.SUMMARY ? 1 : 0.5),
                state: hasSameLanguageTask ? TaskState.SUCCESS : TaskState.RUNNING,
            };
        }));

        const costCredits = tasks.reduce((sum, task) => {
            return sum.add(task.costCredits);
        }, new Prisma.Decimal(0));


        await prisma.$transaction(async trx => {
            try {
                await trx.user.update({
                    where: {
                        id: ctx.session.user.id,
                        credits: {
                            gte: costCredits
                        },
                    },
                    data: {
                        credits: {
                            increment: -costCredits,
                        }
                    }
                });
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === "P2025") {
                        throw new ApiError("可用点数不够");
                    }
                }
                throw e;
            }
            await trx.task.createMany({
                data: tasks
            });
            await trx.creditHistory.create({
                data: {
                    userId: ctx.session.user.id,
                    type: CreditType.TASK,
                    amount: -costCredits,
                },
            });
        });
        const summaryRes = await Promise.all(tasks.map(task => summary(task.id)))
        const failedTaskIds = summaryRes.filter(it => !it.success).map(it => it.taskId);
        const failedTasks = tasks.filter(it => failedTaskIds.includes(it.id));
        if (failedTasks.length) {
            await prisma.$transaction(async trx => {
                await trx.user.update({
                    where: {
                        id: ctx.session.user.id,
                    },
                    data: {
                        credits: {
                            increment: failedTasks.reduce((sum, task) => {
                                return sum.add(task.costCredits);
                            }, new Prisma.Decimal(0)),
                        }
                    }
                });
                await trx.task.updateMany({
                    where: {
                        id: {
                            in: failedTaskIds
                        }
                    },
                    data: {
                        state: TaskState.FAIL,
                        finishedAt: new Date(),
                    }
                });
                await trx.creditHistory.createMany({
                    data: failedTasks.map(task => {
                        return {
                            userId: ctx.session.user.id,
                            amount: task.costCredits,
                            type: CreditType.TASK
                        }
                    })
                });

            });
        }
        if (pdfs.length > 1) {
            return null;
        } else {
            if (failedTasks.length) {
                return null;
            }
            return summaryRes[0].taskId;
        }
    });

export default create;
