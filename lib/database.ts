import {PrismaClient} from "@prisma/client";
import logger from "@/lib/logger";
import compileTemplate from "string-template";

const prisma = new PrismaClient({
    log: [{
        level: 'query',
        emit: 'event',
    }],
});
prisma.$on('query', (e) => {
    logger.info({
        sql: e.query,
        params: e.params,
        duration:e.duration
    })
    // console.log('Params: ' + e.params)
    // console.log('Duration: ' + e.duration + 'ms')
})
export default prisma;
