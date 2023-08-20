import React from "react";
import {Layout} from "@/types";
import AuthHeader from "@/app/(auth)/components/AuthHeader";
import {HiOutlineKey} from "@react-icons/all-files/hi/HiOutlineKey";

const ResetPasswordLayout: Layout = props => {
    return (
        <>
            <AuthHeader title={"重置你的密码"}
                        logo={
                            <div className={'w-14 h-14 border rounded-2xl flex justify-center items-center'}>
                                <HiOutlineKey className={'w-6 h-6 text-primary'}/></div>
                        }
            />
            <div>
                {props.children}
            </div>
        </>
    );
};


export default ResetPasswordLayout;