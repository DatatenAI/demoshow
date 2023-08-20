'use client';
import * as React from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/ui/dialog";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import {useClipboard} from "@/hooks/use-clipboard";

const InviteDialog = React.forwardRef<
    HTMLDivElement, {
    code: string;
    children: React.ReactElement;
}>(({
        code,
        children,
        ...props
    }, ref) => {
    const {
        onCopy,
        value,
        setValue,
        hasCopied
    } = useClipboard(location.protocol + "//" + location.host + "/sign-up?inviteCode=" + code);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {React.cloneElement(children, props)}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] sm:rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>邀请好友</DialogTitle>
                        <DialogDescription>邀请好友，一起获得额外点数</DialogDescription>
                    </DialogHeader>
                    <div className={'gap-2 flex'}>
                        <Input className={'h-9'}
                               value={value}
                               onChange={(e) => {
                                   setValue(e.target.value);
                               }}
                               readOnly/>
                        <Button size={"sm"} className={'shrink-0'} variant={'secondary'}
                                onClick={onCopy}>{hasCopied ? '复制成功' : '复制链接'}</Button>
                    </div>
                    <div className={'text-sm'}>
                        每邀请一个好友完成注册
                        你和你的好友即可获得120点数
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
});

InviteDialog.displayName = 'InviteDialog';
export default InviteDialog;