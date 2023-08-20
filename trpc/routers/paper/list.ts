import {protectedProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {SearchPaperSchema} from "@/lib/validation";
import {Prisma} from "@prisma/client";

const list = protectedProcedure
    .input(SearchPaperSchema)
    .query(async ({input, ctx}) => {

        const where: Prisma.PaperInfoWhereInput = {};
        if (input.years.length) {
            where.year = {
                in: input.years,
            }
        }
        if (input.conferences.length) {
            where.conference = {
                in: input.conferences
            }
        }
        const total = await prisma.paperInfo.count({
            where,
        });
        const orderBy: Prisma.PaperInfoOrderByWithRelationInput = {}
        switch (input.sort) {
            case "cite-asc":
                orderBy.numCitations = 'asc';
                break;
            case 'cite-desc':
                orderBy.numCitations = 'desc';
                break;
            case 'time-asc':
                orderBy.year = 'asc';
                break
            case 'time-desc':
                orderBy.year = 'desc';
                break;
        }
        let papers = [];
        if (total) {
            papers.push(...await prisma.paperInfo.findMany({
                where,
                select: {
                    pdfUrl: true,
                    year: true,
                    title: true,
                    conference: true,
                    authors: true,
                    abstract: true,
                    Keywords: true,
                    bibtex: true,
                    summary: {
                        select: {
                            content: true
                        },
                        where:{
                            language: '中文',
                        }
                    }
                },
                skip: (input.current - 1) * input.size,
                take: input.size,
                orderBy
            }))
        }
        return {
            papers,
            total,
        };
    });

export default list;
