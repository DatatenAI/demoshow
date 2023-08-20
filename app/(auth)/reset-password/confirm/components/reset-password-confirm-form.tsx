"use client";
import React, {FC, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ResetPasswordConfirmSchema} from "@/lib/validation";
import {trpc} from "@/lib/trpc";
import {Label} from "@/ui/label";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import z from "zod";
import {useToast} from "@/ui/use-toast";
import {useRouter} from "next/navigation";

type FormData = z.infer<typeof ResetPasswordConfirmSchema>
const ResetPasswordConfirmForm: FC<{
    email: string;
    token: string;
}> = props => {


    const {toast} = useToast();

    const router = useRouter();


    const [sendSuccess, toggleSendSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<FormData>({
        resolver: zodResolver(ResetPasswordConfirmSchema)
    });

    const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
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
    const resetPassword = async (formData: FormData) => {
        resetPasswordMutation.mutate(formData);
    };

    return <>
        {
            sendSuccess ?
                <div className={"text-center font-medium text-gray-600 dark:text-gray-300 space-y-4"}>
                    <p>您的密码已重置，请使用新密码登录您的账号</p>
                    <Button onClick={()=>router.replace('/sign-in')}>去登录</Button>
                </div> :
                <form onSubmit={handleSubmit(resetPassword)} className="flex flex-col gap-5">
                    <input hidden {...register('token')} value={props.token}/>
                    <div className="space-y-1.5">
                        <Label htmlFor={"email"}>邮箱</Label>
                        <Input
                            placeholder="请输入邮箱"
                            type={"email"}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            value={props.email}
                            readOnly
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor={"password"}>新密码</Label>
                        <Input
                            placeholder="请输入密码"
                            type={"password"}
                            autoComplete="new-password"
                            {...register("newPassword")}
                            error={errors.newPassword?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor={"confirmPassword"}>确认密码</Label>
                        <Input
                            placeholder="请再次输入密码"
                            type={"password"}
                            autoComplete="off"
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                        />
                    </div>
                    <Button type={"submit"} size={"lg"} loading={resetPasswordMutation.isLoading}>确认重置</Button>
                </form>
        }
    </>;
};


export default ResetPasswordConfirmForm;