import type { RpcFaucet } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useEstimatedBalanceQuery({ faucetId }: { faucetId: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id: faucetId,
      options: {
        showContent: true,
      },
    },
    {
      select: (data) => {
        if (data.data?.content?.dataType !== "moveObject") {
          return undefined;
        }
        return (data.data.content.fields as RpcFaucet).balance;
      },
    }
  );
}
