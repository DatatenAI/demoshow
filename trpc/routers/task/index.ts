import "server-only";
import {createTRPCRouter} from "@/trpc";
import list from "./list";
import create from "./create";
import retry from "./retry";
import translate from "./translate";
import upload from "./upload";


const taskRouter = createTRPCRouter({
    list,
    create,
    retry,
    translate,
    upload
});

export default taskRouter;