import {protectedProcedure} from "@/trpc";
import z from "zod";
import prisma from "@/lib/database";
import ApiError from "@/lib/ApiError";
import {CreditType, Prisma, TaskState} from "@prisma/client";
import {nanoid} from "nanoid";
import {summary} from "@/lib/fc";

const retry = protectedProcedure
    .input(z.string())
    .mutation(async ({
                         input,
                         ctx
                     }) => {

        const task = await prisma.task.findUnique({
            where: {
                id: input,
                userId: ctx.session.user.id,
                state: TaskState.FAIL
            }
        });
        if (!task) {
            throw new ApiError("原任务不存在");
        }
        const successTask = await prisma.task.findFirst({
            where: {
                pdfHash: task.pdfHash,
                language: task.language,
                state: TaskState.SUCCESS
            }
        });
        let retryTask: Prisma.TaskUncheckedCreateInput
        if (successTask) {
            retryTask = {
                ...successTask,
                id: nanoid(),
                userId: ctx.session.user.id,
                createdAt: new Date(),
                finishedAt: new Date(),

            };
        } else {
            retryTask = {
                id: nanoid(),
                userId: ctx.session.user.id,
                fileName: task.fileName,
                pdfHash: task.pdfHash,
                type: task.type,
                pages: task.pages,
                costCredits: task.costCredits,
                state: TaskState.RUNNING,
                language: task.language
            };
        }

        await prisma.$transaction(async trx => {
            try {
                await trx.user.update({
                    where: {
                        id: ctx.session.user.id,
                        credits: {
                            gte: retryTask.costCredits
                        },
                    },
                    data: {
                        credits: {
                            increment: -task.costCredits,
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
            await trx.task.create({
                data: retryTask,
            });
            await trx.creditHistory.create({
                data: {
                    userId: ctx.session.user.id,
                    type: CreditType.TASK,
                    amount: -task.costCredits,
                },
            });
            if (!successTask) {
                const invokeRes = await summary(retryTask.id);
                if (!invokeRes.success) {
                    throw new ApiError("运行任务失败");
                }
            }
        });
        return retryTask.id;
    });

export default retry