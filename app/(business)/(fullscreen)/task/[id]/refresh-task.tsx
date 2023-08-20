'use client';
import React, {FC, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import type {Task} from "@prisma/client";

const RefreshTask: FC<{
    task: Pick<Task, 'pdfHash' | 'language' | 'state'>;
}> = props => {
    const router = useRouter();
    const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval>>();

    useEffect(() => {
        if (props.task.state === 'RUNNING') {
            setRefreshInterval(setInterval(() => {
                router.refresh();
            }, 5000));
        }
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    useEffect(() => {
        if (props.task.state !== 'RUNNING') {
            clearInterval(refreshInterval);
        }
    }, [props.task, refreshInterval]);


    return null;
};


export default RefreshTask;