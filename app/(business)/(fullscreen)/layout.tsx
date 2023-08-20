import React from 'react';
import {Layout} from "@/types";

const TaskLayout: Layout = props => {
    return (
        <main className={'w-screen h-screen'}>
            {props.children}
        </main>
    );
};


export default TaskLayout;