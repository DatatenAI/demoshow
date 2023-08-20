'use client';
import React, {FC} from 'react';
import type {CreditPayHistory} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
import dayjs from "dayjs";
import DataTable from "@/ui/data-table";
import usePagination from "@/hooks/use-pagination";
import {trpc} from "@/lib/trpc";
import {Badge} from "@/ui/badge";
import {BiLoaderAlt} from "@react-icons/all-files/bi/BiLoaderAlt";
import {MdError} from "@react-icons/all-files/md/MdError";
import {AiOutlineCheck} from "@react-icons/all-files/ai/AiOutlineCheck";

type PayHistoryColumn = Pick<
    CreditPayHistory,
    "id" | "payNo" | "fee" | "credits" | "createdAt" | "finishedAt" | "status"
>;
export const payHistoryColumnDef: ColumnDef<PayHistoryColumn>[] = [
    {
        accessorKey: "payNo",
        header: "订单编号",
        meta: {
            className: 'w-48',
        },
    },
    {
        accessorKey: "fee",
        header: "充值金额",
        meta: {
            className: 'w-40',
        },
        accessorFn: row => `¥${(Number(row.fee) / 100).toFixed(2)}`,
    },
    {
        accessorKey: "credits",
        header: "充值点数",
        meta: {
            className: 'w-40',
        },
    },
    {
        accessorKey: "createdAt",
        header: "支付时间",
        meta: {
            className: 'w-48',
        },
        accessorFn: row => dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
        accessorKey: "status",
        header: "支付状态",
        meta: {
            className: 'w-48',
        },
        cell: cell => {
            switch (cell.row.original.status) {
                case 'PAYING':
                    return <Badge variant={'info'} plain>
                        <BiLoaderAlt className={'animate-spin mr-1'}/>
                        支付中
                    </Badge>
                case 'SUCCESS':
                    return <Badge variant={"success"} plain>
                        <AiOutlineCheck className={'mr-1'}/>
                        已支付
                    </Badge>
                case 'FAILED':
                    return <Badge variant={"destructive"} plain>
                        <MdError className={'mr-1'}/>
                        支付失败
                    </Badge>
            }

        }
    },
];
const PayHistoryTable: FC = props => {
    const pagination = usePagination();

    const {data, isLoading} = trpc.account.listPayHistory.useQuery({
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
            columns={payHistoryColumnDef}
            loading={isLoading}
            data={data?.histories || []}
        />
    );
};


export default PayHistoryTable;