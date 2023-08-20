import {createTRPCRouter} from "./create";
import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import paperRouter from "@/trpc/routers/paper";
import weappRouter from "@/trpc/routers/weapp";
import wepaperRouter from "@/trpc/routers/wepaper";
import wxfavoriteRouter from "@/trpc/routers/wxfavorite";
import taskRouter from "@/trpc/routers/task";
import summaryRouter from "@/trpc/routers/summary";
import wxHistoryRouter from "@/trpc/routers/wxhistory";
import wxLikeRouter from "@/trpc/routers/wxlike";

export const appRouter = createTRPCRouter({
    account: accountRouter,
    auth: authRouter,
    task: taskRouter,
    paper: paperRouter,
    summary: summaryRouter,
    weapp: weappRouter,
    wepaper: wepaperRouter,
    wxFavorite: wxfavoriteRouter,
    wxHistory: wxHistoryRouter,
    wxLike:wxLikeRouter
});

export type AppRouter = typeof appRouter;
export {
    protectedProcedure,
    publicProcedure,
    createTRPCRouter
} from './create';
