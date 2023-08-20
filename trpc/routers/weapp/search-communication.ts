import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";

// 交流群接口
const searchCommunication = publicProcedure
    .query(async ({input, ctx}) => {
        return await prisma.wxCommunication.findMany({
            orderBy: {
                createTime: 'desc'
            }
        });
    });

export default searchCommunication;
