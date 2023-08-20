import React from 'react';
import {Layout} from "@/types";
import ApplicationHeader from "./header";
import ApplicationFooter from "./footer";

const TaskLayout: Layout = props => {
    return (
        <div className={'space-y-6'}>
            <ApplicationHeader/>
            <main className={'w-full container'}>
                {props.children}
            </main>
            <ApplicationFooter/>
        </div>
    );
};


export default TaskLayout;