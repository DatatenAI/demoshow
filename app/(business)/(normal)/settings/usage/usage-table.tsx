'use client';
import React, {FC} from 'react';
import type {CreditHistory} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
import dayjs from "dayjs";
import usePagination from "@/hooks/use-pagination";
import {trpc} from "@/lib/trpc";
import DataTable from "@/ui/data-table";
import {Badge} from "@/ui/badge";
import {CgFileDocument} from "@react-icons/all-files/cg/CgFileDocument";
import {BsCalendar} from "@react-icons/all-files/bs/BsCalendar";
import {AiOutlineCreditCard} from "@react-icons/all-files/ai/AiOutlineCreditCard";
import {BsChatSquareDots} from "@react-icons/all-files/bs/BsChatSquareDots";
import { AiOutlineShareAlt } from '@react-icons/all-files/ai/AiOutlineShareAlt';
import {FaExchangeAlt} from "@react-icons/all-files/fa/FaExchangeAlt";

type UsageColumn = Pick<
    CreditHistory,
    "id" | "type" | "amount" | "happenedAt"
>;

export const creditColumnDef: ColumnDef<UsageColumn>[] = [
    {
        accessorKey: "happenedAt",
        header: "日期",
        meta: {
            className: 'w-48',
        },
        accessorFn: row => dayjs(row.happenedAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
        accessorKey: "type",
        header: "类型",
        meta: {
            className: 'w-48',
        },
        cell: cell => {
            switch (cell.row.original.type) {
                case 'TASK':
                    return <Badge variant={'info'} plain>
                        <CgFileDocument className={'mr-1'}/>
                        总结
                    </Badge>
                case 'CHAT':
                    return <Badge variant={'info'} plain>
                        <BsChatSquareDots className={'animate-spin mr-1'}/>
                        对话
                    </Badge>
                case 'PURCHASE':
                    return <Badge variant={"success"} plain>
                        <AiOutlineCreditCard className={'mr-1'}/>
                        充值
                    </Badge>
                case 'EXCHANGE':
                    return <Badge variant={"success"} plain>
                        <FaExchangeAlt className={'mr-1'}/>
                        兑换
                    </Badge>
                case 'CHECK_IN':
                    return <Badge variant={"destructive"} plain>
                        <BsCalendar className={'mr-1'}/>
                        签到
                    </Badge>
                case 'INVITE':
                    return <Badge variant={"success"} plain>
                        <AiOutlineShareAlt className={'mr-1'}/>
                        邀请好友
                    </Badge>
            }

        }
    },
    {
        accessorKey: "amount",
        header: "数量",
        meta: {
            className: 'w-40',
        },
        cell: cell => {
            const amount = Number(cell.row.original.amount);
            return <span
                className={'font-semibold'}>{amount < 0 ? amount : `+${amount}`}</span>
        }
    },
];
const UsageTable: FC = props => {
    const pagination = usePagination();
    const {
        data,
        isLoading
    } = trpc.account.listUsageHistory.useQuery({
        current: pagination.current,
        size: pagination.size,
    });

    return (
        <DataTable
            pagination={{
                current: pagination.current,
                total: data?.total,
                size: pagination.size,
                onPageChange: pagination.changePage,
                onSizeChange: pagination.changeSize
            }}
            columns={creditColumnDef}
            loading={isLoading}
            data={data?.histories || []}
        />
    );
};


export default UsageTable;