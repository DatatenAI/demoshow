import z from "zod";
import {PayMethodEnum} from "@/lib/constants";


const email = z.string({
    required_error: '请输入邮箱'
}).email({message: '请输入正确的邮箱'});

const name = z.string({
    required_error: '请输入名称'
}).trim().nonempty({message: "请输入名称"});

const password = z.string({
    required_error: "请输入",
}).trim().nonempty({message: "请输入"}).min(8, "密码最少包含8位字符");

export const PaginationSchema = z.object({
    current: z.number().min(1),
    size: z.number().min(0).max(50),
})

export const SignInSchema = z.object({
    email,
    password
})
export const SignUpSchema = z.object({
    email,
    name,
    password,
    inviteCode: z.string().optional(),
});


export const SendMailSchema = z.object({email})


export const UpdateInfoSchema = z.object({
    name,
    avatar: z.string().url().optional(),
})

export const SetEmailSchema = z.object({
    email
})

export const SetPasswordSchema = z.object({
    newPassword: password.nonempty("请输入新密码"),
    confirmPassword: password.nonempty("请再次输入密码")
}).refine(arg => arg.confirmPassword === arg.newPassword, {
    message: "两次输入密码不一致",
    path: ["confirmPassword"]
});

export const ResetPasswordConfirmSchema = z.object({
    token: z.string()
}).and(SetPasswordSchema);

export const UpdatePasswordSchema = z.object({
    current: password.nonempty("请输入当前密码"),
}).and(SetPasswordSchema);


export const UpdateLanguageSchema = z.object({
    language: z.string({
        required_error: "请选择语言",
    }),
});


export const CreateTaskSchema = z.object({
    pdfFiles: z.optional(z.array(z.object({
        hash: z.string(),
        fileName: z.string()
    }))),
    pdfUrls: z.optional(z.array(z.string().url("请输入正确的链接"))),
    language: z.string(),
}).refine(arg => {
    const isPdfUrlsEmpty = !arg.pdfUrls?.length;
    const isPdfFilesEmpty = !arg.pdfFiles?.length;
    return (isPdfUrlsEmpty !== isPdfFilesEmpty);
}, {
    message: '参数错误',
    path: ['pdfUrls', 'pdfFiles']
});
export const TranslateTaskSchema = z.object({
    id: z.string(),
    language: z.string(),
})

export const ListTaskSchema = PaginationSchema.extend({
    state: z.enum(['ALL', 'RUNNING', 'SUCCESS', 'FAIL']),
})

export const ListPayHistorySchema = PaginationSchema.extend({})
export const ListUsageHistorySchema = PaginationSchema.extend({});

export const ChatSchema = z.object({
    summaryId: z.bigint().optional(),
    question: z.string(),
    language: z.string(),
})
export const ShareSummarySchema = z.string();
export const RechargeSchema = z.object({
    goodId: z.bigint(),
    method: z.nativeEnum(PayMethodEnum),
})
export const ExchangeSchema = z.object({
    key: z.string({
        required_error: '请输入兑换码'
    }),
})

export enum PaperSearchSort {
    TIME_ASC = "time-asc",
    TIME_DESC = "time-desc",
    CITE_ASC = "cite-asc",
    CITE_DESC = "cite-desc",
}


export const SearchPaperSchema = PaginationSchema.extend({
    keywords: z.array(z.string()),
    years: z.array(z.number()),
    conferences: z.array(z.string()),
    sort: z.nativeEnum(PaperSearchSort),
})