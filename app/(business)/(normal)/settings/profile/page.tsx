import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import UserInfoForm from "./user-info-form";
import {Separator} from "@/ui/separator";
import LanguageForm from "./language-form";
import UpdatePasswordForm from "./update-password-form";
import {getCurrentUserId} from "@/lib/auth";
import prisma from "@/lib/database";
import SetPasswordForm from "./set-password-form";
import SetEmailForm from "./set-email-form";
import UpdateEmailForm from "./update-email-form";

export const metadata = {
    title: '个人信息'
}

const ProfilePage: Page = async props => {
    const user = await prisma.user.findUniqueOrThrow({where: {id: await getCurrentUserId()}})!
    return (
        <PageLayout title={metadata.title} className={'pt-0'}>
            <div className={'space-y-6'}>
                <div className={'space-y-4 max-w-md'}>
                    <h2 className={'font-semibold'}>基础信息</h2>
                    <UserInfoForm defaultValues={{name: user.name!, avatar: user.image||undefined}}/>
                </div>
                <Separator/>
                <div className={'space-y-4 max-w-md'}>
                    <h2 className={'font-semibold'}>邮箱设置</h2>
                    {
                        user.email.endsWith("@wechat.com") ? <SetEmailForm/> : <UpdateEmailForm email={user.email}/>
                    }
                </div>
                <Separator/>
                <div className={'space-y-4 max-w-md'}>
                    <h2 className={'font-semibold'}>语言设置</h2>
                    <LanguageForm defaultValues={{language: user.language}}/>
                </div>
                <Separator/>
                <div className={'space-y-4 max-w-md'}>
                    <h2 className={'font-semibold'}>密码设置</h2>
                    {
                        user.password ? <UpdatePasswordForm/> : <SetPasswordForm/>
                    }
                </div>
            </div>
        </PageLayout>
    );
};


export default ProfilePage;