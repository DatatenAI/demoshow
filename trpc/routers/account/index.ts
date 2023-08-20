import {createTRPCRouter} from "@/trpc";
import deleteAccount from "./delete-account";
import setPassword from "./set-password";
import updatePassword from "./update-password";
import recharge from "./recharge";
import exchange from "./exchange";
import checkPayResult from "./check-pay-result";
import checkIn from "./check-in";
import listPayHistory from "./list-pay-history";
import listUsageHistory from "./list-usage-history";
import updateInfo from "./update-info";
import uploadAvatar from "./upload-avatar";
import updateLanguage from "./update-language";
import setEmail from "./set-email";
import updateEmail from "./update-email";


const accountRouter = createTRPCRouter({
    deleteAccount,
    setPassword,
    setEmail,
    updateEmail,
    updateInfo,
    uploadAvatar,
    updatePassword,
    updateLanguage,
    recharge,
    exchange,
    checkPayResult,
    checkIn,
    listPayHistory,
    listUsageHistory
});

export default accountRouter;