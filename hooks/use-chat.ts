import {useMemo, useState} from "react";
import {trpc} from "@/lib/trpc";
import {ChatSchema} from "@/lib/validation";
import z from "zod";
import {TRPCClientError} from "@trpc/client";

type ChatMessage = {
    from: 'system' | 'user';
    type: 'markdown' | 'text';
    content: string;
    loading: boolean;
    error?: boolean;
}

const useChat = (defaultMessages?: ChatMessage[]) => {
    const [messages, setMessages] = useState(defaultMessages || []);
    const chatMutation = trpc.summary.chat.useMutation();

    const loading = useMemo(() => {
        return messages.some(message => message.loading);
    }, [messages]);

    const sendMessage = async (params: z.infer<typeof ChatSchema>) => {
        if (loading) {
            return;
        }
        if (!params.question.length) {
            return;
        }
        const newMessages: ChatMessage[] = [...messages, {
            type: 'text',
            from: 'user',
            content: params.question,
            loading: true,
        }];
        setMessages(newMessages);
        try {
            const res = await chatMutation.mutateAsync(params);
            newMessages[newMessages.length - 1].loading = false;
            const error = res.status !== 'SUCCESS'
            newMessages[newMessages.length - 1].error = error;
            newMessages.push({
                type: error ? 'text' : 'markdown',
                from: 'system',
                content: res.reply!,
                loading: false,
            });
        } catch (e) {
            newMessages[newMessages.length - 1].loading = false;
            newMessages[newMessages.length - 1].error = false;
            newMessages.push({
                type: 'text',
                from: 'system',
                content: e instanceof TRPCClientError ? e.message : '网络异常，请重试',
                loading: false,
            });
        } finally {
            setMessages([...newMessages]);
        }
    }

    return {
        messages,
        setMessages,
        loading,
        sendMessage
    }
}
export default useChat;