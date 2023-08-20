'use client';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Button} from "@/ui/button";
import {AiOutlineSend} from "@react-icons/all-files/ai/AiOutlineSend";
import Image from "next/image";
import Logo from "@/public/logo.jpeg";
import ReactMarkdown from "react-markdown";
import useChat from "@/hooks/use-chat";
import {useSession} from "next-auth/react";
import {Avatar, AvatarFallback, AvatarImage} from "@/ui/avatar";
import {BiUserCircle} from "@react-icons/all-files/bi/BiUserCircle";

const Chat: FC = props => {
    const {
        messages,
        loading,
        sendMessage
    } = useChat([{
        content: '你好, 我是chatpaper, 我能从已收录的5w篇论文中为您提供有用信息, 并展示相关论文, 请问有什么可以帮您的吗?',
        from: 'system',
        type: 'text',
        loading: false,
    }]);

    const chatContainer = useRef<HTMLDivElement>(null)


    useEffect(() => {
        chatContainer.current?.scrollTo({
            top: chatContainer.current?.scrollHeight,
            behavior: "smooth",
        })
    }, [messages]);

    const [inputValue, setInputValue] = useState('');

    const session = useSession();

    const send = () => {
        sendMessage({
            language: '中文',
            question: inputValue
        });
        setInputValue('');
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            send();
        }
    }
    return (
        <div
            className={'relative flex flex-col w-full max-w-4xl mx-auto h-96 border rounded-xl p-4 pr-0 overflow-hidden'}>
            <div className={'pb-14 overflow-auto'} ref={chatContainer}>
                {
                    messages.map((message, idx) => {
                        return <div
                            key={idx}
                            className={`flex p-4 gap-3 text-base md:max-w-2xl  xl:max-w-4xl m-auto ${message.from === 'system' ? '' : 'flex-row-reverse'}`}>
                            {message.from === 'system' ? <Image src={Logo} alt={'logo'}
                                                                className={'w-8 h-8 rounded'}/> :
                                <Avatar className={'w-8 h-8'}>
                                    <AvatarImage src={session.data?.user?.image || undefined}/>
                                    <AvatarFallback><BiUserCircle/></AvatarFallback>
                                </Avatar>}
                            <div
                                className={`py-1.5 px-3 rounded ${message.from === 'system' ? 'bg-gray-100 text-gray-900' : 'bg-primary-600 text-primary-foreground'} text-sm`}>
                                {message.type === 'markdown' ?
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                    : message.content
                                }
                            </div>
                        </div>
                    })
                }
            </div>
            <div className={'flex gap-2 items-center h-14 p-2 absolute w-full left-0 bottom-0 bg-background'}>
                <input className={'w-full h-10 border px-4  focus-visible:outline-primary text-sm rounded-full'}
                       placeholder={'最近的监督学习论文有哪些?'} value={inputValue}
                       onChange={e => setInputValue(e.target.value)}
                       onKeyDown={onKeyDown}
                />
                <Button loading={loading} leftIcon={<AiOutlineSend/>} className={'shrink-0 w-10 h-10'} onClick={send}/>
            </div>
        </div>
    );
};


export default Chat;