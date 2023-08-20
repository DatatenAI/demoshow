import React, {Suspense} from "react";
import {AsyncComponent, Page} from "@/types";
import AuthHeader from "../components/AuthHeader";
import {VerificationTokenType} from "@prisma/client";
import {CgSpinner} from "@react-icons/all-files/cg/CgSpinner";
import Link from "next/link";
import {hashToken} from "@/lib/auth";
import prisma from "@/lib/database";
import {HiOutlineMail} from "@react-icons/all-files/hi/HiOutlineMail";

const getToken = async (token: string) => {
    const hashedToken = hashToken(token);
    const verificationToken = await prisma.verificationToken.findUnique({
        where: {
            token: hashedToken,
            expires: {
                gt: new Date()
            },
        }
    });
    if (verificationToken) {
        const user = await prisma.user.findUnique({where: {email: verificationToken.type === 'register' ? verificationToken.identifier : verificationToken.extra!}});
        if (user) {
            await prisma.$transaction(async trx => {
                await trx.verificationToken.update({
                    where: {
                        token: hashedToken
                    },
                    data: {
                        usedAt: new Date()
                    }
                });
                await trx.user.update({
                    where: {
                        id: user.id
                    },
                    data: verificationToken.type === VerificationTokenType.register ? {
                        emailVerified: new Date()
                    } : {
                        email: verificationToken.identifier
                    }
                });
                const inviteHistory = await trx.inviteHistory.findUnique({
                    where: {
                        inviteUserId: user.id,
                    }
                });
                if (inviteHistory) {
                    await prisma.user.update({
                        where:{
                            id: inviteHistory.userId,
                        },
                        data:{
                            credits:{
                                increment: 120,
                            }
                        }
                    })
                }
            });
        }
    }
    return verificationToken;

};

const VerifyResult: AsyncComponent<{
    token: string
}> = async props => {
    const verificationToken = await getToken(props.token);
    let verificationSuccess = false;

    if (verificationToken) {
        verificationSuccess = true;
    }

    return <>
        <AuthHeader
            title={verificationSuccess ? "邮箱验证成功" : "验证链接已过期，请重试"}
            logo={<div className={'w-14 h-14 border rounded-2xl flex justify-center items-center'}>
                <HiOutlineMail className={'w-6 h-6 text-primary'}/></div>}
        />
        {
            verificationSuccess ? <div className={"flex justify-center"}>
                <Link href={"/sign-in"}
                      className={"rounded-lg text-sm font-semibold shadow-xs bg-primary hover:opacity-90  text-white dark:text-gray-200 h-10 px-4 py-2.5"}>去登录</Link>
            </div> : null
        }
    </>;
};

const VerifyEmailPage: Page = props => {
    const searchParams = props.searchParams;
    const token = searchParams?.token as string | undefined;
    if (!token) {
        throw new Error('token invalid');
    }

    return (
        <Suspense fallback={<>
            <AuthHeader title={"正在验证邮箱，请稍后"}
                        logo={<div className={'w-14 h-14 border rounded-2xl flex justify-center items-center'}>
                            <HiOutlineMail className={'w-6 h-6 text-primary'}/></div>}/>
            <div>
                <CgSpinner className={"animate-spin text-primary w-7 h-7 mx-auto"}/>
            </div>
        </>}>
            <VerifyResult token={token}/>
        </Suspense>
    );
};


export default VerifyEmailPage;