"use client";
import React, {FC, ReactNode} from "react";
import Link from "next/link";
import {useSelectedLayoutSegment} from "next/navigation";
import {cn} from "@/lib/cn";
import {BiUser} from "@react-icons/all-files/bi/BiUser";
import {BiCreditCard} from "@react-icons/all-files/bi/BiCreditCard";
import {MdDataUsage} from "@react-icons/all-files/md/MdDataUsage";

const SideMenuItem: FC<{
    children: ReactNode;
    segment: string | null;
    active?: boolean;
}> = (props) => {
    return <Link href={"/settings/" + (props.segment || "")} prefetch={false}
                 className={cn("py-2 px-3 text-sm font-semibold cursor-pointer rounded-md inline-flex items-center gap-1", {
                     "bg-primary-50": props.active,
                     "text-primary-500": props.active,
                 })}>{props.children}</Link>;
};

const segments = [{
    label: "个人信息",
    segment: "profile",
    icon: <BiUser className={'w-4 h-4'}/>
}, {
    label: "账户余额",
    segment: "billing",
    icon: <BiCreditCard className={'w-4 h-4'}/>
}, {
    label: "用量明细",
    segment: "usage",
    icon: <MdDataUsage className={'w-4 h-4'}/>
}];
const SideMenu: FC<{
    className?: string
}> = props => {

    const currentSegment = useSelectedLayoutSegment();
    return <div className={props.className}>
        {segments.map(({label, segment, icon}) => {
            return <SideMenuItem segment={segment} key={segment}
                                 active={currentSegment === segment}>
                {icon}
                {label}
            </SideMenuItem>;
        })}
    </div>;
};


export default SideMenu;