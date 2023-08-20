import React, {FC} from 'react';
import {cn} from "@/lib/cn";

const spanClass = cn('absolute rounded-full w-full h-full  bg-gradient-to-r from-primary via-[#84cdfa] to-[#5ad1cd]');
const Loading: FC = props => {
    return <div className={'h-full flex justify-center items-center'}>
        <div
            className="absolute top-1/2 left-1/2 rounded-full w-16 h-16 animate-rotate after:absolute after:inset-2.5 after:bg-white after:border-white after:border-4 after:rounded-full  bg-gradient-to-r from-primary via-[#84cdfa] to-[#5ad1cd]">
            <span className={cn(spanClass,'blur-sm')}></span>
            <span className={cn(spanClass,'blur-md')}></span>
            <span className={cn(spanClass,'blur-xl')}></span>
            <span className={cn(spanClass,'blur-2xl')}></span>
        </div>
    </div>;
};


export default Loading;