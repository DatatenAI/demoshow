import "server-only";
import {createTRPCRouter} from "@/trpc";
import getOpenId from "@/trpc/routers/weapp/open-id";
import insertWxUser from "@/trpc/routers/weapp/insert-user";
import getCode from "@/trpc/routers/weapp/get-code";
import bindEmail from "@/trpc/routers/weapp/bind-email";
import searchInform from "@/trpc/routers/weapp/search-inform";
import informDetail from "@/trpc/routers/weapp/inform-detail";
import addFeedback from "@/trpc/routers/weapp/add-feedback";
import searchCommunication from "@/trpc/routers/weapp/search-communication";
import statistic from "@/trpc/routers/weapp/statistic";
import getQrcode from "@/trpc/routers/weapp/qrcode";


const weappRouter = createTRPCRouter({
    getOpenId,
    insertWxUser,
    getCode,
    bindEmail,
    searchInform,
    addFeedback,
    searchCommunication,
    statistic,
    getQrcode,
    informDetail
});

export default weappRouter;
