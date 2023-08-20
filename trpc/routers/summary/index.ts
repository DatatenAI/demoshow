import "server-only";
import {createTRPCRouter} from "@/trpc";
import chat from "./chat";
import share from "./share";


const summaryRouter = createTRPCRouter({
    chat,
    share
});

export default summaryRouter;