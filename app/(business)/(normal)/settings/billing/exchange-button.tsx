'use client';
import React, {FC, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ExchangeSchema, SetEmailSchema} from "@/lib/validation";
import {trpc} from "@/lib/trpc";
import z from "zod";
import {useToast} from "@/ui/use-toast";
import {useSession} from "next-auth/react";

type FormData = z.infer<typeof ExchangeSchema>

const ExchangeButton:FC = () => {
    const {toast} = useToast();
    const form = useForm<FormData>({
        resolver: zodResolver(ExchangeSchema),
    });
    const session = useSession();

    const exchangeMutation = trpc.account.exchange.useMutation({
        onSuccess: (data) => {
            toast({
                title: '兑换成功',
                description: `${data}点数已添加到您的账户`
            });
            setShowDialog(false);
            session.update();
        },
        onError: e => {
            toast({
                variant: 'destructive',
                title: '兑换失败',
                description: e.message,
            })
        }
    });
    const [showDialog, setShowDialog] = useState(false);


    const onSubmit = (formData: FormData) => {
        exchangeMutation.mutate(formData);
    }
    return (
        <>
            <Button onClick={() => setShowDialog(true)} variant={'secondary'}>兑换点数</Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>兑换</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="key"
                                render={({field}) => {
                                    return <FormItem>
                                        <FormLabel>兑换码</FormLabel>
                                        <FormControl>
                                            <Input  {...field} placeholder={'请输入兑换码'}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                            />
                            <Button className={'w-full'} type="submit"
                                    loading={exchangeMutation.isLoading}>确认兑换</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};


export default ExchangeButton;