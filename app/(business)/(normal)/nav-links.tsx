"use client";
import React, {FC} from "react";
import Link from "next/link";
import {useSelectedLayoutSegment} from "next/navigation";
import {cn} from "@/lib/cn";

const navs = [{
    label: "首页",
    link: "home"
}, {
    label: "我的总结",
    link: "tasks"
}, {
    label: "论文查询",
    link: "search"
}];


const NavLinks: FC = props => {
    const currentSegment = useSelectedLayoutSegment();

    return (
        <div className={"text-gray-700 font-semibold space-x-4 text-sm"}>
            {navs.map(nav => {
                return <Link prefetch={false} key={nav.link} href={'/'+nav.link}
                             className={cn("px-3 py-2 rounded-lg hover:bg-accent", {
                                 "bg-accent": currentSegment === nav.link
                             })}>{nav.label}</Link>;
            })}
        </div>
    );
};


export default NavLinks;