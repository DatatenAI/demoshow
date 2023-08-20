"use client";
import React, {FC, useState} from "react";
import {Label} from "@/ui/label";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SendMailSchema} from "@/lib/validation";
import z from "zod";
import {useRouter} from "next/navigation";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";

type FormData = z.infer<typeof SendMailSchema>
const ResetPasswordForm: FC = props => {


    const {toast} = useToast();

    const router = useRouter();

    const [sendSuccess, toggleSendSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<FormData>({
        resolver: zodResolver(SendMailSchema)
    });

    const resetPasswordMailMutation = trpc.auth.resetPasswordMail.useMutation({
        onError: error => {
            toast({
                title: error.message,
                variant: "destructive"
            });
        },
        onSuccess: data => {
            toggleSendSuccess(true);
        }
    });
    const sendEmail = async (formData: FormData) => {
        resetPasswordMailMutation.mutate(formData);
    };

    return <>
        {
            sendSuccess ?
                <div className={"text-center leading-8 font-medium text-gray-600 dark:text-gray-300"}>
                    <p>你将会收到一封重置密码的邮件</p>
                    <p>点击邮件中的链接进行下一步操作</p>
                </div> :
                <form onSubmit={handleSubmit(sendEmail)} className="flex flex-col gap-5">
                    <div className="space-y-1.5">
                        <Label htmlFor={"email"}>邮箱</Label>
                        <Input
                            placeholder="请输入邮箱"
                            type={"email"}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                    </div>
                    <Button loading={resetPasswordMailMutation.isLoading} type={"submit"}
                            size={"lg"}>发送邮件</Button>
                    <Button onClick={() => router.back()} variant={"link"} type={"button"}>返回登录</Button>
                </form>
        }
    </>;
};


export default ResetPasswordForm;