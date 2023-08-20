'use client';
import React, {FC} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Button} from "@/ui/button";
import z from "zod";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";
import {UpdatePasswordSchema} from "@/lib/validation";
import {Input} from "@/ui/input";

type FormData = z.infer<typeof UpdatePasswordSchema>
const UpdatePasswordForm: FC<{}> = props => {

    const {toast} = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(UpdatePasswordSchema),
    });

    const updateMutation = trpc.account.updatePassword.useMutation({
        onSuccess: () => {
            toast({
                title: '操作成功',
                description: `密码已修改`,
            });
        }
    });

    const onSubmit = (formData: FormData) => {
        updateMutation.mutate(formData);
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="current"
                render={({field}) => {
                    return <FormItem>
                        <FormLabel>当前密码</FormLabel>
                        <FormControl>
                            <Input type={'password'} {...field} placeholder={'请输入当前密码'} autoComplete="off"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }}
            />
            <FormField
                control={form.control}
                name="newPassword"
                render={({field}) => {
                    return <FormItem>
                        <FormLabel>新密码</FormLabel>
                        <FormControl>
                            <Input type={'password'} {...field} placeholder={'请输入新密码'}
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
                        <FormLabel>再次输入</FormLabel>
                        <FormControl>
                            <Input type={'password'} {...field} placeholder={'请再次输入密码'} autoComplete="off"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }}
            />
            <Button type="submit" loading={updateMutation.isLoading}>更新</Button>
        </form>
    </Form>
};


export default UpdatePasswordForm;