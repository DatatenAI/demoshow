import {FetchCreateContextFnOptions, fetchRequestHandler} from "@trpc/server/adapters/fetch";
import {appRouter} from "@/trpc";
import {getSession} from "@/lib/auth";
import {Api} from "@/types";
import logger from "@/lib/logger";
import * as crypto from "crypto";
import ApiError from "@/lib/ApiError";

const handler: Api = (req) => {
    const requestLogger = logger.child({
        requestId: process.env['REQUEST_ID'] || crypto.randomUUID(),
    });
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: async (opts: FetchCreateContextFnOptions) => {
            const session = await getSession();
            return {
                session,
                logger: requestLogger
            };
        },
        onError: ({error, type, path, input, ctx, req}) => {
            if (error.cause instanceof ApiError) {
                logger.error(error.message);
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }else{
                    logger.error(error);
                }
            }

        }
    });
};
export {handler as GET, handler as POST};

