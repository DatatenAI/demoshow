import React from "react";
import {Page} from "@/types";
import ResetPasswordConfirmForm from "./components/reset-password-confirm-form";
import {hashToken} from "@/lib/auth";
import {VerificationTokenType} from "@prisma/client";

import Link from "next/link";
import prisma from "@/lib/database";

const validateTokenAndGetEmail = async (token: string) => {

    const hashedToken = hashToken(token);
    const verificationToken = await prisma.verificationToken.findUnique({
        where: {
            token: hashedToken,
            expires: {
                gt: new Date()
            },
            type: VerificationTokenType.reset_password
        }
    });
    return verificationToken?.identifier;
};

const ResetPasswordConfirmPage: Page = async (props) => {
    const searchParams = props.searchParams;

    const token = searchParams?.token as string|undefined;
    if (!token) {
        throw new Error('token invalid');
    }
    const email = await validateTokenAndGetEmail(token);

    return (
        <>
            {email ? <ResetPasswordConfirmForm email={email} token={token}/> : <div className={"text-center"}>
                <p className={"font-normal text-gray-600 dark:text-gray-300 mb-12"}>链接已过期</p>
                <Link prefetch={false} href={"/"}
                      className={"rounded-lg text-sm font-semibold shadow-xs bg-primary hover:opacity-90"}>返回</Link>
            </div>}
        </>
    );
};
export default ResetPasswordConfirmPage;
