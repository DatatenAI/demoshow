import {Page} from "@/types";
import React from "react";
import Header from "../../header";
import prisma from "@/lib/database";
import {notFound} from "next/navigation";
import SummaryContent from "../../summary-content";
import RefreshTask from "./refresh-task";
import {getFileUrl} from "@/lib/oss";
import {getCurrentUser} from "@/lib/auth";
import TaskStateBadge from "@/components/task-state-badge";


const TaskDetail: Page<"id"> = async props => {
    const id = props.params.id as string | undefined;
    if (!id) {
        return notFound();
    }
    const user = (await getCurrentUser())!;
    const task = await prisma.task.findUnique({
        select: {
            pdfHash: true,
            language: true,
            state: true,
            fileName: true
        },
        where: {
            id,
            userId: user.id
        }
    });
    if (!task) {
        return notFound();
    }
    const summary = await prisma.summary.findUnique({
        where: {
            pdfHash_language: {
                pdfHash: task.pdfHash,
                language: task.language
            }
        }
    });
    const chats = [];
    if (summary) {
        chats.push(...await prisma.chat.findMany({
                select: {
                    question: true,
                    reply: true,
                    status: true,
                },
                where: {
                    summaryId: summary.id,
                    userId: user.id,
                }
            })
        )
    }

    const pdfUrl = getFileUrl("uploads", task.pdfHash + ".pdf");
    return <div>
        <Header logined title={summary?.title || task.fileName} extra={<TaskStateBadge state={task.state}/>}/>
        <SummaryContent
            language={task.language}
            taskState={task.state}
            summary={summary}
            chats={chats}
            pdfUrl={pdfUrl}
            avatar={user.image}
            logined/>
        <RefreshTask task={task}/>
    </div>
}
export default TaskDetail;