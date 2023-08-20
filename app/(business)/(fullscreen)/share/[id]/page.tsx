import {Page} from "@/types";
import React from "react";
import Header from "../../header";
import prisma from "@/lib/database";
import {notFound} from "next/navigation";
import SummaryContent from "../../summary-content";
import {getFileUrl} from "@/lib/oss";
import {getCurrentUser} from "@/lib/auth";


const ShareDetail: Page<"id"> = async props => {
    const id = props.params.id as string | undefined;
    if (!id) {
        return notFound();
    }
    const user = await getCurrentUser();
    const share = await prisma.shareHistory.findUnique({
        where: {
            id: parseInt(id),
        }
    });
    if (!share) {
        return notFound();
    }
    const summary = await prisma.summary.findUnique({
        where: {
            id: share.summaryId
        }
    });
    if (!summary) {
        return notFound();
    }
    const chats = [];
    if (user) {
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
        );
    }

    const pdfUrl = getFileUrl("uploads", summary.pdfHash + ".pdf");
    return <div>
        <Header logined={!!user} title={summary.title}/>
        <SummaryContent
            language={summary.language}
            taskState={'SUCCESS'}
            summary={summary}
            chats={chats}
            pdfUrl={pdfUrl}
            logined={!!user}
            avatar={user?.image}
        />
    </div>
}
export default ShareDetail;