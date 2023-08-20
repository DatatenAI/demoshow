'use client';
import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/ui/dialog";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import {useClipboard} from "@/hooks/use-clipboard";
import {trpc} from "@/lib/trpc";
import {AiOutlineShareAlt} from "@react-icons/all-files/ai/AiOutlineShareAlt";
import {useToast} from "@/ui/use-toast";
import {AiOutlineLoading} from "@react-icons/all-files/ai/AiOutlineLoading";
import {AiOutlineCheck} from "@react-icons/all-files/ai/AiOutlineCheck";
import {AiOutlineCheckCircle} from "@react-icons/all-files/ai/AiOutlineCheckCircle";

const ShareDialog: FC<{
    summaryId: bigint;
}> = ({
          summaryId,
      }) => {

    const {toast} = useToast();

    const shareMutation = trpc.summary.share.useMutation({
        onSuccess: data => {
            setValue(location.protocol + "//" + location.host + "/share/" + data);
        },
        onError: error => {
            toast({
                title: '分享失败',
                description: error.message
            })
        }
    });

    const [opened, setOpened] = useState(false);

    const {
        onCopy,
        value,
        setValue,
        hasCopied
    } = useClipboard('');

    useEffect(() => {
        if (opened) {
            shareMutation.mutate(summaryId);
        }
    }, [opened, summaryId]);


    return (
        <Dialog open={opened} onOpenChange={setOpened}>
            <DialogTrigger asChild>
                <Button size={"sm"} variant={'ghost'} leftIcon={<AiOutlineShareAlt/>}/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] sm:rounded-2xl" showClose={false}>
                <DialogHeader>
                    <DialogTitle className={'text-center'}>分享总结</DialogTitle>
                </DialogHeader>
                <div className={'mx-auto space-y-6 py-4 flex flex-col justify-center items-center w-80 h-80'}>
                    {
                        shareMutation.isLoading ?
                            <AiOutlineLoading className={'fill-primary animate-spin w-20 h-20'}/> :
                            <AiOutlineCheckCircle className={'fill-primary w-20 h-20'}/>
                    }
                    <Input className={'h-9'}
                           value={value}
                           onChange={(e) => {
                               setValue(e.target.value);
                           }}
                           readOnly/>
                    <Button size={"sm"} className={'w-full'} disabled={shareMutation.isLoading}
                            onClick={onCopy} leftIcon={hasCopied ?
                        <AiOutlineCheck/> : undefined}>{hasCopied ? '复制成功' : '复制链接'}</Button>
                    <Button size={"sm"} className={'w-full'} variant={'outline'}
                            onClick={() => setOpened(false)}>取消</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
ShareDialog.displayName = 'ShareDialog';


export default ShareDialog;