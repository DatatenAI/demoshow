import React, {FC, ReactElement} from 'react';
import {Separator} from "@/ui/separator";
import {cn} from "@/lib/cn";

const PageLayout: FC<{
    title?: string;
    children: ReactElement|ReactElement[];
    className?: string
}> = props => {
    return (
        <div className={cn('pt-6', props.className)}>
            {
                props.title ? <>
                    <div>
                        <h1 className={'text-gray-900 text-3xl font-semibold'}>
                            {props.title}
                        </h1>
                    </div>
                    <Separator className={'mt-5 mb-8'}/></> : null
            }
            {props.children}
        </div>
    );
};


export default PageLayout;