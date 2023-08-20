'use client';
import React, {FC} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Button} from "@/ui/button";
import z from "zod";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";
import {SetEmailSchema} from "@/lib/validation";
import {Input} from "@/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/ui/dialog";
import {useRouter} from "next/navigation";
import {AiOutlineMail} from "@react-icons/all-files/ai/AiOutlineMail";

type FormData = z.infer<typeof SetEmailSchema>
const SetEmailForm: FC<{}> = props => {

    const {toast} = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(SetEmailSchema),
    });

    const updateMutation = trpc.account.setEmail.useMutation({
        onSuccess: () => {
            toast({
                title: '验证邮件已发送',
                description: `请点击邮件中的链接完成验证`,
            });
        }
    });

    const onSubmit = (formData: FormData) => {
        updateMutation.mutate(formData);
    }
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary" leftIcon={<AiOutlineMail/>}>绑定邮箱</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>绑定邮箱</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => {
                            return <FormItem>
                                <FormLabel>邮箱</FormLabel>
                                <FormControl>
                                    <Input type={'email'} {...field} placeholder={'请输入邮箱'}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }}
                    />
                    <Button className={'w-full'} type="submit" loading={updateMutation.isLoading}>提交</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>


};


export default SetEmailForm;