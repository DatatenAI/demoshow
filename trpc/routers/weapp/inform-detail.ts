import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {searchSchema} from "@/lib/wx-validation";


const informDetail = publicProcedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
        const {id} = input
        return await prisma.wxInform.findUnique({
            where: {
                id
            }
        });
    });

export default informDetail;
