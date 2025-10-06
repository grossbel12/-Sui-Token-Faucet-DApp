import { EnokiClientContext } from "@/hooks/useEnokiClient";
import type { EnokiClient } from "@mysten/enoki";
import type { PropsWithChildren } from "react";

type EnokiClientProviderProps = PropsWithChildren<{
  client: EnokiClient;
}>;

export function EnokiClientProvider({
  client,
  children,
}: EnokiClientProviderProps) {
  return (
    <EnokiClientContext.Provider value={client}>
      {children}
    </EnokiClientContext.Provider>
  );
}
