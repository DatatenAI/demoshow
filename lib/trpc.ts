'use client';
import {createTRPCReact} from "@trpc/react-query";
import type {inferRouterInputs, inferRouterOutputs} from "@trpc/server";
import {type AppRouter} from "@/trpc";

export type {PrismaClient} from "@prisma/client";


export const trpc = createTRPCReact<AppRouter>({});

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
