"use client";
import React, {FC} from "react";
import {SignUpSchema} from "@/lib/validation";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {Label} from "@/ui/label";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";
import {useSearchParams} from "next/navigation";


type FormData = z.infer<typeof SignUpSchema>
const SignUpForm: FC = props => {
    const searchParams = useSearchParams();
    const code = searchParams.get('inviteCode') || undefined;
    const {toast} = useToast();

    const signUpMutation = trpc.auth.signUp.useMutation({
        onError: error => {
            toast({
                title: error.message,
            });
        },
        onSuccess: data => {
            toast({
                title: "发送邮件成功",
                description: '验证邮件已发送，请点击邮件中的链接以完成注册。',
            });
        }
    });


    const {
        register,
        handleSubmit,
        formState: {errors},
        getValues
    } = useForm<FormData>({
        resolver: zodResolver(SignUpSchema)
    });

    const signUpWithEmail = (data: FormData) => {
        signUpMutation.mutate(data);
    };

    return <form onSubmit={handleSubmit(signUpWithEmail)} className="flex flex-col gap-5">
        <div className="space-y-1.5">
            <Label htmlFor={"name"}>姓名</Label>
            <Input
                placeholder="请输入姓名"
                autoComplete="name"
                {...register("name")}
                error={errors.name?.message}
            />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor={"email"}>邮箱</Label>
            <Input
                placeholder="请输入邮箱"
                type={"email"}
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
            />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor={"inviteCode"}>邀请码</Label>
            <Input
                placeholder="选填"
                defaultValue={code}
                {...register("inviteCode")}
                error={errors.inviteCode?.message}
            />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor={"password"}>密码</Label>
            <Input
                placeholder="请输入密码"
                type={"password"}
                autoComplete="new-password"
                {...register("password")}
                error={errors.password?.message}
            />
        </div>
        <Button type={"submit"} loading={signUpMutation.isLoading}>确认</Button>
    </form>;
};


export default SignUpForm;