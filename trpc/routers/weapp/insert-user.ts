import {insertUserSchema} from "@/lib/wx-validation";
import prisma from "@/lib/database";
import {appProtectedProcedure} from "@/trpc/create";


const insertWxUser = appProtectedProcedure
    .input(insertUserSchema)
    .mutation(async ({input, ctx}) => {
        const {openId,unionId,nickName,avatar,phone,gender,birthday,country,province,city,educational,interest,intro,email} = input;
        return await prisma.wxUser.upsert({
            where: {
                openId: openId,
            },
            update: {
                nickName: nickName,
                avatar: avatar,
                phone: phone,
                email: email,
                gender: gender,
                birthday: birthday,
                country: country,
                province: province,
                city: city,
                educational: educational,
                interest: interest,
                intro: intro
            },
            create: {
                openId: openId,
                unionId: unionId,
                nickName: nickName,
                avatar: avatar,
                phone: phone,
                email: email,
                gender: gender,
                birthday: birthday,
                country: country,
                province: province,
                city: city,
                educational: educational,
                interest: interest,
                intro: intro,
                createTime: new Date()
            },
            select: {
                id: true,
                openId: true,
                unionId: true,
                nickName: true,
                avatar: true,
                phone: true,
                email: true,
                gender: true,
                birthday: true,
                country: true,
                province: true,
                city: true,
                educational: true,
                intro: true,
                interest: true,
                createTime: true
            }
        });
    });

export default insertWxUser;
