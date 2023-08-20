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
import {useSession} from "next-auth/react";

type FormData = z.infer<typeof SetEmailSchema>
const UpdateEmailForm: FC<{
    email: string
}> = props => {

    const {toast} = useToast();


    const form = useForm<FormData>({
        resolver: zodResolver(SetEmailSchema),
        defaultValues: {
            email: props.email
        }
    });

    const updateMutation = trpc.account.updateEmail.useMutation({
        onSuccess: (data) => {
            if (data) {
                toast({
                    title: '验证邮件已发送',
                    description: `请点击邮件中的链接完成验证`,
                });
            }
        }
    });

    const onSubmit = (formData: FormData) => {
        updateMutation.mutate(formData);
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="email"
                render={({field}) => {
                    return <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                            <Input  {...field} placeholder={'请输入邮箱'}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }}
            />
            <Button type="submit" loading={updateMutation.isLoading}>更新</Button>
        </form>
    </Form>
};


export default UpdateEmailForm;