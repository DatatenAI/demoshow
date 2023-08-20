import React, {cache} from 'react';
import {Page} from "@/types";
import PaperTable from "./paper-table";
import prisma from "@/lib/database";

const getSearchConditions = cache(async () => {
        const years = (await prisma.paperInfo.findMany({
            select: {
                year: true,
            },
            distinct: 'year',
        })).map(it => it.year).filter((it): it is number => it !== null);
        const conferences = (await prisma.paperInfo.findMany({
            select: {
                conference: true,
            },
            distinct: 'conference',
        })).map(it => it.conference).filter((it): it is string => it !== null);

        const keywords: string[] = [];
        return {years, conferences, keywords}

    }
)

const SearchPage: Page = async props => {
    const conditions = await getSearchConditions();


    return (
        <PaperTable conditions={conditions}/>
    );
};


export const dynamic = 'force-dynamic';
export default SearchPage;
export const metadata = {
    title: "论文搜索"
};