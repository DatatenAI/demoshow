'use client';
import React, {ReactElement} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/ui/table";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table"
import {Pagination, PaginationProps} from "@/ui/pagination";
import {BiLoaderAlt} from "@react-icons/all-files/bi/BiLoaderAlt";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[] | undefined;
    toolbar?: ReactElement;
    loading?: boolean;
    pagination?: PaginationProps;
}

const DataTable = <TData, TValue>({
                                      columns,
                                      data = [],
                                      toolbar,
                                      loading,
                                      pagination
                                  }: DataTableProps<TData, TValue>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <div className={'space-y-3.5'}>
            {toolbar ? <div>{toolbar}</div> : null}
            <div className={'rounded-xl border relative'}>
                {
                    loading ? <div className={'w-full h-full absolute bg-opacity-50 bg-white'}>
                        <BiLoaderAlt
                            className={'animate-spin absolute top-1/2 left-1/2 -ml-4 -mt-4 w-8 h-8 text-primary'}/>
                    </div> : null
                }
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className={'hover:bg-muted/0'}>
                                <TableCell colSpan={columns.length} className="h-24 text-center">暂无数据</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination ? <Pagination {...pagination}/> : null}
        </div>
    )
};


export default DataTable;