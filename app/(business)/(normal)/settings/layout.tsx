import React from "react";
import {Layout} from "@/types";
import SideMenu from "./side-menu";

const SettingLayout: Layout = props => {
    return (
        <div className={"w-full flex gap-12 mt-8"}>
            <SideMenu className={"w-48 flex flex-col gap-2"}/>
            <div className={"flex-grow"}>
                {props.children}
            </div>
        </div>
    );
};


export default SettingLayout;