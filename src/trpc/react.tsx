"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = useMemo(
    () =>
      api.createClient({
        transformer,
        links: [
          loggerLink({
            enabled: (op) =>
              process.env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error),
          }),
          unstable_httpBatchStreamLink({
            url: getUrl(),
            async headers() {
              const token = await getToken();
              return {
                Authorization: token ? `Bearer ${token}` : undefined,
                "x-trpc-source": "react",
              };
            },
          }),
        ],
      }),
    [getToken],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
