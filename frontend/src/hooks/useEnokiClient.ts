import type { EnokiClient } from "@mysten/enoki";
import { createContext, useContext } from "react";

export const EnokiClientContext = createContext<EnokiClient | undefined>(
  undefined
);

export function useEnokiClient() {
  const enokiClient = useContext(EnokiClientContext);

  if (!enokiClient)
    throw new Error(
      "useEnokiClient should be use inside EnokiClientContext.Provider"
    );

  return enokiClient;
}
