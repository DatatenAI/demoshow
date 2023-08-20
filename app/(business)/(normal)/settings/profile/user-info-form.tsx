'use client';
import {FieldPathValue, FieldValues, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Input} from "@/ui/input";
import {Button} from "@/ui/button";
import React, {FC} from "react";
import z from "zod";
import {UpdateInfoSchema,} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/ui/use-toast";
import {trpc} from "@/lib/trpc";
import {Avatar, AvatarFallback, AvatarImage} from "@/ui/avatar";
import {BiUserCircle} from "@react-icons/all-files/bi/BiUserCircle";
import {useSession} from "next-auth/react";
import {AiOutlineCamera} from "@react-icons/all-files/ai/AiOutlineCamera";

type FormData = z.infer<typeof UpdateInfoSchema>;

const MAX_FILE_SIZE = 1024 * 1024;
const UserInfoForm: FC<{
    defaultValues: FormData
}> = props => {

    const {toast} = useToast();

    const uploadAvatarMutation = trpc.account.uploadAvatar.useMutation();

    const session = useSession();

    const updateMutation = trpc.account.updateInfo.useMutation({
        onSuccess: () => {
            toast({
                title: '操作成功',
                description: `信息已修改`,
            });
            session.update();
        }
    });

    const form = useForm<FormData>({
        resolver: zodResolver(UpdateInfoSchema),
        defaultValues: props.defaultValues,
    });

    const onSubmit = (formData: FormData) => {
        updateMutation.mutate(formData)
    }
    const chooseFile = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (event: (React.ChangeEvent | FieldPathValue<FieldValues, string>)) => void) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            if (file.size >= MAX_FILE_SIZE) {
                toast({
                    title: '请上传1M以下的图片',
                })
            } else {
                try {
                    const uploadUrl = await uploadAvatarMutation.mutateAsync(file.name);
                    await new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest()
                        xhr.upload.onerror = e => {
                            reject("upload error");
                        };
                        xhr.upload.onload = e => {
                            resolve(null);
                        }
                        xhr.open("PUT", uploadUrl, true);
                        xhr.setRequestHeader("Content-Type", file.type);
                        xhr.send(file);
                    });
                    const uploadURL = new URL(uploadUrl);
                    onChange(uploadURL.origin + uploadURL.pathname)
                } catch (e) {
                    toast({
                        title: '上传失败,请重试',
                    })
                }
            }
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="avatar"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>头像</FormLabel>
                        <FormControl>
                            <Avatar className={'w-20 h-20 group'}>
                                <AvatarImage src={field.value}/>
                                <AvatarFallback><BiUserCircle/></AvatarFallback>
                                <div
                                    className={'w-full h-full  z-10 hidden absolute  left-0 top-0 bg-black bg-opacity-50  items-center justify-center text-white  group-hover:flex  transition duration-200 ease-in-out transform opacity-0 hover:opacity-100'}>
                                    <AiOutlineCamera className={'w-6 h-6'}/>
                                    <input
                                        type="file"
                                        accept={'image/*'}
                                        className={'w-full h-full opacity-0 absolute left-0 top-0 cursor-pointer'}
                                        onChange={e => chooseFile(e, field.onChange)}
                                    />
                                </div>
                            </Avatar>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>名称</FormLabel>
                        <FormControl>
                            <Input placeholder="请输入名称" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <Button type="submit" loading={updateMutation.isLoading}>更新</Button>
        </form>
    </Form>
};


export default UserInfoForm;