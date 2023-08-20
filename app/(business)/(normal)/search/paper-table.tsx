'use client';
import React, {FC, useState} from 'react';
import {BsPeople} from "@react-icons/all-files/bs/BsPeople";
import {AiOutlineBuild} from "@react-icons/all-files/ai/AiOutlineBuild";
import {AiOutlineCalendar} from "@react-icons/all-files/ai/AiOutlineCalendar";
import PaperTableFilter, {SearchPaperParams} from "./paper-table-filter";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import {Sheet, SheetContent, SheetTrigger} from "@/ui/sheet";
import {Button} from "@/ui/button";
import usePagination from "@/hooks/use-pagination";
import {trpc} from "@/lib/trpc";
import {Pagination} from "@/ui/pagination";
import {PaperSearchSort} from "@/lib/validation";
import {Dialog, DialogContent, DialogTitle} from "@/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle, AlertDialogTrigger
} from "@/ui/alert-dialog";

const PaperTable: FC<{
    conditions: {
        keywords: string[];
        years: number[];
        conferences: string[];
    }
}> = props => {
    const [searchParams, setSearchParams] = useState<SearchPaperParams>({
        keywords: [],
        years: [],
        conferences: [],
        sort: PaperSearchSort.TIME_DESC
    });


    const pagination = usePagination(1, 8);


    const {data, isLoading,} = trpc.paper.list.useQuery({
        current: pagination.current,
        size: pagination.size,
        ...searchParams
    });
    const onSearch = (params: SearchPaperParams) => {
        setSearchParams(params);
    }

    return (
        <div className={'space-y-8'}>
            <PaperTableFilter conditions={props.conditions} onSearch={onSearch} initParams={searchParams}
                              loading={isLoading}/>
            <div className={'space-y-4'}>
                {
                    (data?.papers || []).map((paper, idx) => {
                        return <div key={idx} className={'border rounded-lg p-4 space-y-2'}>
                            <div className={'font-semibold text-lg'}>{paper.title}</div>
                            <div className={'flex gap-2 flex-wrap'}>
                                {
                                    paper.Keywords?.length ? (JSON.parse(paper.Keywords) as string[]).map(keyword => {
                                        return <span key={keyword}
                                                     className={'bg-primary text-white h-6 rounded-lg text-xs px-2 py-1'}>{keyword}</span>
                                    }) : null
                                }
                            </div>
                            <div className={'space-x-4 text-sm text-gray-500 flex items-center'}>
                                <div className={'space-x-2 flex items-center'}>
                                    <BsPeople/>
                                    <div className={'space-x-1'}>
                                        {
                                            paper.authors?.length ? (JSON.parse(paper.authors) as string[]).map(author => {
                                                return <span key={author}
                                                             className={'underline'}>{author}</span>
                                            }) : null
                                        }
                                    </div>
                                </div>
                                <div className={'space-x-2 flex items-center'}>
                                    <AiOutlineBuild/>
                                    <span>{paper.conference || '无'}</span>
                                </div>
                                <div className={'space-x-2 flex items-center'}>
                                    <AiOutlineCalendar/>
                                    <span>{paper.year}</span>
                                </div>
                            </div>
                            <div className={'text-sm font-medium'}>{paper.abstract}</div>
                            <div className={'space-x-2'}>
                                <Sheet>
                                    <SheetTrigger asChild disabled={!paper.summary.length}>
                                        <Button size={'xs'}>查看总结</Button>
                                    </SheetTrigger>
                                    <SheetContent className={'xl:max-w-lg overflow-y-auto'}>
                                        <article className={'prose prose-sm'}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {paper.summary[0]?.content}
                                            </ReactMarkdown>
                                        </article>
                                    </SheetContent>
                                </Sheet>
                                <Button size={'xs'} onClick={() => window.open(paper.pdfUrl)}
                                        variant={'secondary'}>PDF下载</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild disabled={!paper.bibtex?.length}>
                                        <Button size={'xs'} variant={'secondary'}>Bibtex</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogTitle>Bibtex</AlertDialogTitle>
                                        {paper.bibtex}
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>关闭</AlertDialogCancel>
                                            <AlertDialogAction>复制</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </div>

                        </div>
                    })
                }
                <Pagination total={data?.total || 0} current={pagination.current} size={pagination.size}
                            onPageChange={pagination.changePage}
                            onSizeChange={pagination.changeSize}/>
            </div>
        </div>
    );
};


export default PaperTable;