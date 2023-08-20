"use client";
import {FC, ReactNode} from "react";
import {SessionProvider} from "next-auth/react";
import {Session} from "next-auth";

const AuthProvider: FC<{
    children: ReactNode
}> = props => {
    return <SessionProvider refetchOnWindowFocus={false}>{props.children}</SessionProvider>;
};
export default AuthProvider;