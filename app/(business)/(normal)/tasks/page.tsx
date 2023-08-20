'use client';
import React, {ReactElement, useState} from 'react';
import {Page} from "@/types";
import DataTable from "@/ui/data-table";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import {Tabs, TabsList, TabsTrigger} from "@/ui/tabs";
import {trpc} from "@/lib/trpc";
import {ListTaskSchema, UpdateLanguageSchema} from "@/lib/validation";
import z from "zod";
import usePagination from "@/hooks/use-pagination";
import {ColumnDef} from "@tanstack/react-table";
import {Task, TaskState, TaskType} from "@prisma/client";
import TaskStateBadge from "@/components/task-state-badge";
import dayjs from "dayjs";
import {Badge} from "@/ui/badge";
import {CgFileDocument} from "@react-icons/all-files/cg/CgFileDocument";
import {HiTranslate} from "@react-icons/all-files/hi/HiTranslate";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import {Button} from "@/ui/button";
import {FiMoreHorizontal} from "@react-icons/all-files/fi/FiMoreHorizontal";
import Link from "next/link";
import {AiOutlineEye} from "@react-icons/all-files/ai/AiOutlineEye";
import {AiOutlineRedo} from "@react-icons/all-files/ai/AiOutlineRedo";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/ui/alert-dialog";
import {useToast} from "@/ui/use-toast";
import {useRouter} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/ui/select";
import {languages} from "@/lib/constants";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Input} from "@/ui/input";

type QuerySchema = z.infer<typeof ListTaskSchema>;

type TaskColumn = Pick<
    Task,
    "id" | "fileName" | "state" | "createdAt" | "finishedAt" | "type" | "pages" | "costCredits"
>;

const TaskTypeBadges: Record<TaskType, ReactElement> = {
    SUMMARY: <Badge>
        <CgFileDocument className={'mr-1'}/>
        总结
    </Badge>,
    TRANSLATE: <Badge className={'bg-violet-500'}>
        <HiTranslate className={'mr-1'}/>
        翻译
    </Badge>,
};
type TranslateFormData = z.infer<typeof UpdateLanguageSchema>

const filterStates = [
    {value: 'ALL', label: '全部'},
    {value: 'RUNNING', label: '运行中'},
    {value: 'SUCCESS', label: '成功'},
    {value: 'FAIL', label: '失败'}
];


const TaskPage: Page = props => {
    const [state, setState] = useState<QuerySchema['state']>('ALL');
    const pagination = usePagination(1, 8);

    const {toast} = useToast();
    const router = useRouter();

    const {data, isLoading} = trpc.task.list.useQuery({
        current: pagination.current,
        size: pagination.size,
        state: state
    });

    const retryMutation = trpc.task.retry.useMutation({
        onSuccess: data => {
            router.push(`/task/${data}`);
        },
        onError: error => {
            toast({
                variant: 'destructive',
                title: '请求失败',
                description: error.message,
            })
        }
    });

    const translateMutation = trpc.task.translate.useMutation({
        onSuccess: data => {
            router.push(`/task/${data}`);
        },
        onError: error => {
            toast({
                variant: 'destructive',
                title: '请求失败',
                description: error.message,
            })
        }
    });


    const [showRetry, setShowRetry] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false);

    const [currentData, setCurrentData] = useState<TaskColumn>();
    const [language, setLanguage] = useState<string>();

    const translateForm = useForm<TranslateFormData>({
        resolver: zodResolver(UpdateLanguageSchema),
    });


    const changeState = (e: string) => {
        setState(e as QuerySchema['state']);
        pagination.changePage(1);
    };

    const retry = async () => {
        retryMutation.mutate(currentData!.id)
    }
    const translate = async (formData: TranslateFormData) => {
        translateMutation.mutate({
            ...formData,
            id: currentData!.id,
        });
    }

    const openRetry = (row: TaskColumn) => {
        setCurrentData(row)
        setShowRetry(true);
    }
    const openTranslate = (row: TaskColumn) => {
        setCurrentData(row)
        setShowTranslate(true);
    }

    const taskColumnDefs: ColumnDef<TaskColumn>[] = [
        {
            accessorKey: "fileName",
            header: "文件名称"
        },
        {
            accessorKey: "type",
            header: "任务类型",
            meta: {
                className: 'w-40',
            },
            cell: ({cell}) => {
                console.log(cell.getContext().table)
                return TaskTypeBadges[cell.getValue() as TaskType];
            },
        },
        {
            accessorKey: "pages",
            header: "页数",
            meta: {
                className: 'w-20',
            },
        },
        {
            accessorKey: "costCredits",
            header: "消耗",
            meta: {
                className: 'w-20',
            },
        },
        {
            accessorKey: "state",
            header: "状态",
            meta: {
                className: 'w-40',
            },
            cell: ({cell}) => {
                return <TaskStateBadge state={cell.getValue() as TaskState}/>
            },
        },
        {
            accessorKey: "createdAt",
            header: "创建时间",
            meta: {
                className: 'w-48',
            },
            accessorFn: row => dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            accessorKey: "finishedAt",
            header: "结束时间",
            accessorFn: row => row.finishedAt ? dayjs(row.finishedAt).format("YYYY-MM-DD HH:mm:ss") : null,
            meta: {
                className: 'w-48',
            },
        },
        {
            id: "actions",
            header: '操作',
            meta: {
                className: 'w-40',
            },
            cell: ({row}) => {
                return <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <FiMoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/task/${row.original.id}`} prefetch={false}>
                                <AiOutlineEye className={'mr-2'}/>
                                <span>查看详情</span>
                            </Link>
                        </DropdownMenuItem>
                        {
                            row.original.state === 'SUCCESS' ? <>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <span onClick={() => openTranslate(row.original)}>
                                        <HiTranslate className={'mr-2'}/>
                                        <span>翻译</span>
                                    </span>
                                </DropdownMenuItem>
                            </> : null
                        }
                        {
                            row.original.state === "FAIL" ? <>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <span onClick={() => openRetry(row.original)}>
                                        <AiOutlineRedo className={'mr-2'}/>
                                        <span>重试</span>
                                    </span>
                                </DropdownMenuItem>
                            </> : null
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        },
    ];


    return (
        <PageLayout title={'我的总结'}
        >
            <DataTable
                pagination={{
                    current: pagination.current,
                    total: data?.total,
                    size: pagination.size,
                    onPageChange: pagination.changePage,
                    onSizeChange: pagination.changeSize
                }}
                toolbar={<div>
                    <Tabs value={state} onValueChange={changeState}>
                        <TabsList>
                            {filterStates.map(it => {
                                return <TabsTrigger key={it.value} value={it.value}>{it.label}</TabsTrigger>
                            })}
                        </TabsList>
                    </Tabs>
                </div>}
                columns={taskColumnDefs}
                loading={isLoading}
                data={data?.tasks || []}
            />
            <AlertDialog open={showRetry} onOpenChange={setShowRetry}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认重新运行任务?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <Button onClick={retry} loading={retryMutation.isLoading}>确认</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showTranslate} onOpenChange={setShowTranslate}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>请选择需要翻译的语言</AlertDialogTitle>
                    </AlertDialogHeader>
                    <Form {...translateForm}>
                        <form onSubmit={translateForm.handleSubmit(translate)} className="space-y-4">
                            <FormField
                                control={translateForm.control}
                                name="language"
                                render={({field}) => {
                                    return <FormItem>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="请选择语言"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map(language => {
                                                        return <SelectItem value={language.value}
                                                                           key={language.value}>{language.label}</SelectItem>
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <Button type={"submit"} loading={retryMutation.isLoading}>确认</Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>

                </AlertDialogContent>
            </AlertDialog>
        </PageLayout>
    );
};


export default TaskPage;