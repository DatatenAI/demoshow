import "server-only";
import {createTRPCRouter} from "@/trpc";
import searchKeyWords from "@/trpc/routers/wepaper/search-keywords";
import searchPaper from "@/trpc/routers/wepaper/search-paper";
import paperDetail from "@/trpc/routers/wepaper/paper-detail";
import searchMyKeyWords from "@/trpc/routers/wepaper/search-my-keywords";
import cancelSubscribe from "@/trpc/routers/wepaper/cancel-subscribe";
import addSubscribe from "@/trpc/routers/wepaper/add-subscribe";
import addRead from "@/trpc/routers/wepaper/add-read";
import cancelRead from "@/trpc/routers/wepaper/cancel-read";
import searchMyRead from "@/trpc/routers/wepaper/search-my-read";


const wepaperRouter = createTRPCRouter({
    addRead,
    cancelRead,
    searchMyRead,
    cancelSubscribe,
    addSubscribe,
    searchKeyWords,
    searchMyKeyWords,
    searchPaper,
    paperDetail
});

export default wepaperRouter;
