import z from "zod";


const code = z.string();
const userId =  z.union([z.number(), z.null()]).optional();
const keywords = z.union([z.string(), z.undefined()]).optional();
const keywordId = z.number();
const openId = z.string();
const unionId = z.string();
const paperId = z.number();
const id = z.number().optional();
const nickName = z.union([z.string(), z.null()]).optional();
const avatar = z.union([z.string(), z.null()]).optional();
const phone = z.union([z.string(), z.null()]).optional();
const email = z.string();
const gender = z.union([z.string(), z.null()]).optional();
const birthday = z.union([z.string(), z.null()]).optional();
const country = z.union([z.string(), z.null()]).optional();
const province = z.union([z.string(), z.null()]).optional();
const city = z.union([z.string(), z.null()]).optional();
const educational = z.union([z.string(), z.null()]).optional();
const interest = z.union([z.string(), z.null()]).optional();
const intro = z.union([z.string(), z.null()]).optional();
const favoriteName = z.union([z.string(), z.null()]).optional();
const favoriteId = z.union([z.number(), z.null()]).optional();
const source = z.union([z.string(), z.null()]).optional();
const type = z.enum(["SUGGEST", "BUG"]);
const content = z.string();
const pageNum = z.number();
const pageSize = z.number();

export const codeSchema = z.object({code});
export const openIdSchema = z.object({openId});
export const bindEmailSchema = z.object({userId,openId,email,code});
export const searchPaperSchema = z.object({userId,openId,keywords,pageNum,pageSize});
export const searchPaperDetail = z.object({paperId,userId,openId});
export const scarchMyKeywordsSchema = z.object({userId,openId});
export const subscribeSchema = z.object({keywordId,openId,userId});
export const scarchFavoriteSchema = z.object({userId,openId});
export const insertFavoriteSchema = z.object({userId,openId,favoriteName,favoriteId,paperId,source});
export const addLikeSchema = z.object({userId,openId,paperId});
export const addReadSchema = z.object({userId,openId,paperId});
export const searchSchema = z.object({id,userId,openId,favoriteId,pageNum,pageSize});
export const searchSummarySchema = z.object({pageNum,pageSize,email});
export const addFeedBackSchema = z.object({userId,openId,type,content});

export const insertUserSchema = z.object({
    nickName,
    openId,
    unionId,
    avatar,
    phone,
    email,
    gender,
    birthday,
    country,
    province,
    city,
    educational,
    interest,
    intro
});


