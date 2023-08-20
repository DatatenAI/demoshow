import prisma from "@/lib/database";
import {searchPaperSchema} from "@/lib/wx-validation";
import {appPublicProcedure} from "@/trpc/create";
import {flag} from "arg";


const searchPaper = appPublicProcedure
    .input(searchPaperSchema)
    .query(async ({input, ctx}) => {
        const {keywords, pageNum, pageSize} = input
        const keywordList = await prisma.keywords.findMany(
            {
                where: {
                    OR: [
                        {
                            searchKeywords:
                                {
                                    contains: keywords
                                }
                        },
                        {
                            keywordShort:
                                {
                                    contains: keywords
                                }
                        }
                    ]
                },
                include: {
                    keywordsPdf: true,
                },
            }
        );
        const urls:string[] = [];
        // 遍历关键词对象数组
        keywordList.forEach((keyword) => {
            // 提取每个对象中的keywordpdf集合
            const keywordsPdf = keyword.keywordsPdf;

            // 遍历keywordpdf集合中的每个对象，提取pdf字段
            keywordsPdf.forEach((keywordPdf) => {
                const pdfUrl = keywordPdf.pdfUrl;
                urls.push(pdfUrl);
            });
        });
        const paperList = await prisma.paperInfo.findMany({
            take: pageSize, // 指定每页要获取的结果数量
            skip: (pageNum - 1) * pageSize, // 根据当前页码计算要跳过的结果数量
            where: {
                pdfUrl: {
                    in: urls,
                },
                summary: {
                    some: {
                        pdfHash: {
                            not: undefined
                        }
                    }
                }
            },
            include: {
                summary: true,
            },
            orderBy: {
                createTime: 'desc',
            },
        });
        const resultList: (prisma.paperInfo & { waitFlag: boolean })[] = paperList.map(
            (paper) => ({
                ...paper,
                waitFlag: false,
            })
        );
        //查询是否被加入待阅
        if (ctx.session != null && ctx.session.wxuser != null) {
            const ids = resultList.map(obj => obj.id);
            const waitList = await prisma.wxWaitRead.findMany({
                where: {
                    openId: ctx.session.wxuser.openid,
                    paperId: {
                        in: ids
                    }
                }
            })
            resultList.forEach(item => {
                const waitItem = waitList.find(waitItem => waitItem.paperId === item.id);
                if (waitItem) {
                    item.waitFlag = true
                }
            })
        }
        return resultList;
    });

export default searchPaper;
