import React from "react";
import Link from "next/link";
import {Page} from "@/types";
import SignUpForm from "./components/sign-up-form";
import AuthHeader from "../components/AuthHeader";
import {Separator} from "@/ui/separator";
import OAuthGroup from "../components/OAuthGroup";
import {cookies} from "next/headers";

export const metadata = {
    title: "创建账号"
};

const SignUpPage: Page = async (props) => {

    return <>
        <AuthHeader title={"创建一个账号"}/>
        <div className={"flex flex-col gap-6"}>
            <SignUpForm/>
            <Separator/>
            <OAuthGroup/>
        </div>
        <p className="text-center text-sm font-normal text-gray-600 dark:text-gray-400">
            已经有账号?
            <Link prefetch={false} href="/sign-in"
                  className="font-semibold text-primary ml-1">登录</Link>
        </p>
    </>;
};


export default SignUpPage;

