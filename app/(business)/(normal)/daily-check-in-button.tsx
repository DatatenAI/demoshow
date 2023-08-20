'use client';
import React, {FC, useState} from 'react';
import {BsCalendar} from "@react-icons/all-files/bs/BsCalendar";
import {Button} from "@/ui/button";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";
import {useSession} from "next-auth/react";

const DailyCheckInButton: FC<{
    checked: boolean
}> = props => {

    const {toast} = useToast();
    const [checked, setChecked] = useState(props.checked)
    const [dialogVisible, setDialogVisible] = useState(false);
    const session = useSession();
    const checkInMutation = trpc.account.checkIn.useMutation({
        onSuccess: (data) => {
            toast({
                title: '签到成功',
                description: `恭喜获得${Number(data).toFixed(0)}点数`,
            })
            setChecked(true);
            session.update();
            // setDialogVisible(true);
        },
        onError: err => {
            toast({
                title: err.message,
            })
        }
    });

    const checkIn = async () => {
        if (checked) {
            return;
        }
        checkInMutation.mutate();
    }
    return (
        <>
            <Button size={"xs"} leftIcon={<BsCalendar className={'w-3 h-3'}/>} onClick={checkIn}
                    loading={checkInMutation.isLoading}
                    className={'w-24'}
                    variant={checked ? 'secondary' : 'default'}>{checked ? '已签到' : '每日签到'}</Button>
        </>
    );
};


export default DailyCheckInButton;