import "server-only";
import {createTRPCRouter} from "@/trpc";
import list from "./list";


const paperRouter = createTRPCRouter({
    list
});

export default paperRouter;