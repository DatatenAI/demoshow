import "server-only";
import {Session} from "next-auth";
import {initTRPC, TRPCError} from "@trpc/server";
import superJson from "superjson";
import {ZodError} from "zod";
import type {Logger} from "pino";
import ApiError from "@/lib/ApiError";
import {headers} from "next/headers";
import jwt from 'jsonwebtoken';

type TRPCContext = {
    session: Session | null,
    logger: Logger
}


const t = initTRPC.context<TRPCContext>().create({
    transformer: superJson,
    isDev: process.env.NODE_ENV === "production",
    errorFormatter({shape, error}) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zod: error.cause instanceof ZodError ? error.cause.flatten() : null
            },
            message: error.code === "INTERNAL_SERVER_ERROR" ? (error.cause instanceof ApiError ? shape.message : "服务器异常") : shape.message
        };
    }
});


export const createTRPCRouter = t.router;

const logMiddleware = t.middleware(({ctx, path, rawInput, next}) => {
    ctx.logger.info({path, input: rawInput});
    return next();
});
export const publicProcedure = t.procedure.use(logMiddleware);


const authMiddleware = t.middleware(({ctx, next}) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({code: "UNAUTHORIZED"});
    }
    return next({
        ctx: {
            session: {...ctx.session, user: ctx.session.user}
        }
    });
});


export const protectedProcedure = publicProcedure.use(authMiddleware);



const appMiddleware = t.middleware(({ctx, path, rawInput, next}) => {
    const header = headers();
    // 从请求头中获取鉴权信息
    const authToken = header.get('Authorization');
    // 验证Token是否存在
    if (authToken) {
        return next({
            ctx: {
                session: {...ctx.session, wxuser: extractUserInfo(authToken)}
            }
        });
    }
    return next()
});
export const appPublicProcedure = t.procedure.use(appMiddleware);



const appAuthMiddleware = t.middleware(({ctx, next}) => {
    const header = headers();
    // 从请求头中获取鉴权信息
    const authToken = header.get('Authorization');
    // 验证Token是否存在
    if (!authToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
        validateToken(authToken);
        return next({
            ctx: {
                session: {...ctx.session, wxuser: extractUserInfo(authToken)}
            }
        });
    } catch (err) {
        throw new TRPCError({ code: "BAD_REQUEST" });
    }
});

// 自定义的Token验证函数
const validateToken = (token:string) => {
    const secretKey = process.env.WX_AUTH_SECRETKEY;
    try {
        jwt.verify(token, secretKey);
    } catch (err) {
        throw new TRPCError({ code: "BAD_REQUEST" });
    }
};

// 从Token中提取用户信息
const extractUserInfo = (token:string) => {
    const secretKey = process.env.WX_AUTH_SECRETKEY;

    try {
        const decoded = jwt.verify(token, secretKey);
        return {
            openid: decoded.openid,
            // 其他字段...
        };
    } catch (err) {
        throw new TRPCError({ code: "BAD_REQUEST" });
    }
};

export const appProtectedProcedure = publicProcedure.use(appAuthMiddleware);
