import "server-only";
import {createTRPCRouter} from "@/trpc";
import signUp from "./sign-up";
import resetPassword from "./reset-password";
import resetPasswordMail from "./reset-password-mail";


const authRouter = createTRPCRouter({
    signUp,
    resetPassword,
    resetPasswordMail,
});

export default authRouter;