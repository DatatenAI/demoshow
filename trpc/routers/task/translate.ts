import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import ApiError from "@/lib/ApiError";
import {CreditType, Prisma, TaskState, TaskType} from "@prisma/client";
import {nanoid} from "nanoid";
import {summary} from "@/lib/fc";
import {TranslateTaskSchema} from "@/lib/validation";

const translate = protectedProcedure
    .input(TranslateTaskSchema)
    .mutation(async ({
                         input,
                         ctx
                     }) => {

        const task = await prisma.task.findUnique({
            where: {
                id: input.id,
                userId: ctx.session.user.id,
                state: TaskState.SUCCESS
            }
        });
        if (!task) {
            throw new ApiError("原任务不存在");
        }
        const successTask = await prisma.task.findFirst({
            where: {
                pdfHash: task.pdfHash,
                language: input.language,
                state: TaskState.SUCCESS
            }
        });
        let translateTask: Prisma.TaskUncheckedCreateInput
        if (successTask) {
            translateTask = {
                ...successTask,
                type: TaskType.TRANSLATE,
                id: nanoid(),
                userId: ctx.session.user.id,
                createdAt: new Date(),
                finishedAt: new Date(),
            };
        } else {
            translateTask = {
                id: nanoid(),
                userId: ctx.session.user.id,
                fileName: task.fileName,
                pdfHash: task.pdfHash,
                type: TaskType.TRANSLATE,
                pages: task.pages * 0.5,
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
                            gte: translateTask.costCredits
                        },
                    },
                    data: {
                        credits: {
                            increment: -translateTask.costCredits,
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
                data: translateTask,
            });
            await trx.creditHistory.create({
                data: {
                    userId: ctx.session.user.id,
                    type: CreditType.TASK,
                    amount: -task.costCredits,
                },
            });
            if (!successTask) {
                const invokeRes = await summary(translateTask.id);
                if (!invokeRes.success) {
                    throw new ApiError("运行任务失败");
                }
            }
        });
        return translateTask.id;
    });

export default translate