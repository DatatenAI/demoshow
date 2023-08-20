import {Adapter, AdapterAccount, AdapterUser, VerificationToken,} from "next-auth/adapters";
import {CreditType, Prisma, PrismaClient, VerificationTokenType} from "@prisma/client";
import {nanoid} from "nanoid";
import {cookies} from "next/headers";
import {User} from "next-auth";

const PrismaAdapter = (prisma: PrismaClient) => {
    const adapter: Adapter = {
        createSession(session) {
            return prisma.session.create({
                data: session
            });
        },
        deleteSession(sessionToken: string) {
            return prisma.session.delete({
                where: {
                    sessionToken
                }
            });
        },
        async getSessionAndUser(sessionToken: string) {
            const userAndSession = await prisma.session.findUnique({
                where: {sessionToken},
                include: {user: true},
            })
            if (!userAndSession) return null
            const {
                user,
                ...session
            } = userAndSession
            return {
                user,
                session
            }
        },
        updateSession(session) {
            return prisma.session.update({
                where: {
                    sessionToken: session.sessionToken
                },
                data: session,
            });
        },

        async createUser(data: Omit<AdapterUser, "id">) {
            // if (data.image) {
            //     data.image = (await uploadRemoteFile(data.image, "avatar")).url;
            // }
            const inviteCode = cookies().get("inviteCode")?.value;
            let inviteUser: User | null = null;
            if (inviteCode) {
                inviteUser = await prisma.user.findUnique({
                    where: {
                        inviteCode
                    }
                });
            }
            return prisma.$transaction(async trx => {
                const newUser = await trx.user.create({
                    data: {
                        ...data,
                        emailVerified: new Date(),
                        language: '中文',
                        credits: inviteUser ? 120 : 0,
                        inviteCode: nanoid(10),
                    },
                });
                if (inviteUser) {
                    await trx.user.update({
                        where: {
                            id: inviteUser.id
                        },
                        data: {
                            credits: {
                                increment: 120,
                            }
                        }
                    });
                    await trx.creditHistory.createMany({
                        data: {
                            userId: inviteUser.id,
                            type: CreditType.INVITE,
                            amount: 120,
                        }
                    });
                    await trx.inviteHistory.create({
                        data: {
                            userId: inviteUser.id,
                            inviteUserId: newUser.id
                        }
                    })

                }
                return newUser;
            })
        },

        getUser(id: string) {
            return prisma.user.findUnique({
                select: {
                    id: true,
                    email: true,
                    emailVerified: true,
                },
                where: {id},
            });
        },

        async getUserByAccount(
            provider_providerAccountId: Pick<
                AdapterAccount,
                "provider" | "providerAccountId"
            >
        ) {
            const account = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId,
                },
                select: {user: true},
            });
            return account?.user ?? null;
        },

        getUserByEmail(email: string) {
            return prisma.user.findUnique({
                select: {
                    id: true,
                    email: true,
                    emailVerified: true,
                },
                where: {email},
            });
        },

        async linkAccount({
                              access_token,
                              token_type,
                              refresh_token,
                              expires_at,
                              session_state,
                              id_token,
                              ...data
                          }: AdapterAccount) {
            const {
                accessToken,
                tokenType,
                refreshToken,
                expiresAt,
                idToken,
                sessionState,
                scope,
                type,
                ...account
            } = await prisma.account.create({
                data: {
                    ...data,
                    accessToken: access_token,
                    tokenType: token_type,
                    refreshToken: refresh_token,
                    expiresAt: expires_at,
                    idToken: id_token,
                },
            });
            return {
                ...account,
                access_token: accessToken || undefined,
                token_type: tokenType || undefined,
                refresh_token: refreshToken || undefined,
                expires_at: expiresAt || undefined,
                id_token: idToken || undefined,
                session_state: sessionState || undefined,
                scope: scope || undefined,
                type,
            } satisfies AdapterAccount;
        },

        updateUser({
                       id,
                       ...data
                   }: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
            return prisma.user.update({
                where: {id},
                data,
            });
        },

        async createVerificationToken(
            data: VerificationToken
        ): Promise<VerificationToken | null | undefined> {
            return await prisma.verificationToken.create({
                data: {
                    ...data,
                    type: VerificationTokenType.register,
                },
            });
        },

        deleteUser(id: string): Promise<AdapterUser | null | undefined> {
            return prisma.user.delete({where: {id}});
        },

        async unlinkAccount(
            provider_providerAccountId: Pick<
                AdapterAccount,
                "provider" | "providerAccountId"
            >
        ): Promise<void> {
            await prisma.account.delete({where: {provider_providerAccountId}});
        },

        async useVerificationToken(params: {
            identifier: string;
            token: string;
        }): Promise<VerificationToken | null> {
            try {
                return await prisma.verificationToken.update({
                    where: {token: params.token},
                    data: {
                        usedAt: new Date(),
                    },
                });
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2025") {
                        return null;
                    }
                }
                throw error;
            }
        },
    };
    return adapter;
};

export default PrismaAdapter;
