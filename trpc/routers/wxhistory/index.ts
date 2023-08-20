import "server-only";
import {createTRPCRouter} from "@/trpc";
import searchHistory from "@/trpc/routers/wxhistory/search-history";
import searchSummaryHistory from "@/trpc/routers/wxhistory/search-summary-history";


const wxHistoryRouter = createTRPCRouter({
    searchHistory,
    searchSummaryHistory
});

export default wxHistoryRouter;
