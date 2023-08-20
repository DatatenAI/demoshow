import prisma from "@/lib/database";

export async function addWxHistory(openId: string, paperId: number): Promise<void> {
    await prisma.wxHistory.upsert({
        where: {
            openId_paperId: {
                openId: openId,
                paperId: paperId
            }
        },
        update: {
            createTime: new Date()
        },
        create: {
            openId: openId,
            paperId: paperId,
            createTime: new Date()
        },
    });
}

export default addWxHistory;





