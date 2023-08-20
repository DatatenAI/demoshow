import React from "react";
import Link from "next/link";
import {Page} from "@/types";
import SignInForm from "./components/sign-in-form";
import AuthHeader from "../components/AuthHeader";
import OAuthGroup from "../components/OAuthGroup";
import {Separator} from "@/ui/separator";

export const metadata = {
    title: '登录'
}
const SignInPage: Page = async (props) => {

    return (
        <>
            <AuthHeader title={"登录你的账号"} subtitle={"欢迎回来！输入你的凭证继续"}/>
            <div className={"flex flex-col gap-6"}>
                <SignInForm/>
                <Separator/>
                <OAuthGroup/>
            </div>
            <p className="text-center text-sm font-normal text-gray-600 dark:text-gray-400">
                还没有账号?
                <Link prefetch={false} href="/sign-up"
                      className="font-semibold text-primary  ml-1">注册</Link>
            </p>
        </>
    );
};

export default SignInPage;
