'use client';
import React, {FC} from 'react';
import Split from 'react-split'
import PdfViewer from "./pdf-viewer";
import ChatContainer from "./chat-container";
import type {Chat, Summary, TaskState} from "@prisma/client";


const SummaryContent: FC<{
    summary: Summary | null;
    chats: Pick<Chat, 'question' | 'reply' | 'status'>[];
    pdfUrl: string;
    avatar?: string | null;
    taskState?: TaskState;
    language: string;
    logined: boolean;
}> = props => {

    return <Split
        className={'w-full h-screen pt-16 flex'}
        minSize={400}>
        <PdfViewer pdfUrl={props.pdfUrl}/>
        <ChatContainer summary={props.summary} chats={props.chats} taskState={props.taskState} logined={props.logined}
                       avatar={props.avatar} language={props.language}/>

    </Split>;
};


export default SummaryContent;