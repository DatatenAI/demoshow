'use client';
import React, {FC} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Button} from "@/ui/button";
import z from "zod";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";
import {SetPasswordSchema} from "@/lib/validation";
import {Input} from "@/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/ui/dialog";
import {HiLockOpen} from "@react-icons/all-files/hi/HiLockOpen";
import {useRouter} from "next/navigation";

type FormData = z.infer<typeof SetPasswordSchema>
const SetPasswordForm: FC<{}> = props => {

    const {toast} = useToast();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(SetPasswordSchema),
    });

    const updateMutation = trpc.account.setPassword.useMutation({
        onSuccess: () => {
            toast({
                title: '操作成功',
                description: `密码已设置`,
            });
            router.refresh();
        }
    });

    const onSubmit = (formData: FormData) => {
        updateMutation.mutate(formData);
    }
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary" leftIcon={<HiLockOpen/>}>设置密码</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>设置密码</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({field}) => {
                            return <FormItem>
                                <FormLabel>密码</FormLabel>
                                <FormControl>
                                    <Input type={'password'} {...field} placeholder={'请输入密码'}
                                           autoComplete="new-password"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => {
                            return <FormItem>
                                <FormLabel>确认密码</FormLabel>
                                <FormControl>
                                    <Input type={'password'} {...field} placeholder={'请再次输入密码'}
                                           autoComplete="off"/>
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


export default SetPasswordForm;