"use client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {trpc} from "@/lib/trpc";
import superjson from "superjson";
import {httpBatchLink, loggerLink} from "@trpc/client";
import {FC, ReactNode} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        }
    }
});

const tRpcClient = trpc.createClient({
    transformer: superjson,
    links: [
        loggerLink({
            enabled: (opts) =>
                process.env.NODE_ENV === "development" ||
                (opts.direction === "down" && opts.result instanceof Error)
        }),
        httpBatchLink({
            url: `/api/trpc`
        })
    ]
});

export const TrpcProvider: FC<{ children: ReactNode }> = p => {
    return (
        <trpc.Provider client={tRpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {p.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
};