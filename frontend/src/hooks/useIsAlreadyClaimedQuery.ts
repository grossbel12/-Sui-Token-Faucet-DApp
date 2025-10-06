import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useIsAlreadyClaimedQuery({
  faucetId,
  accountAddress,
}: {
  faucetId: string;
  accountAddress: string | undefined;
}) {
  return useSuiClientQuery(
    "getDynamicFieldObject",
    {
      parentId: faucetId,
      name: {
        type: "address",
        value: accountAddress!,
      },
    },
    {
      enabled: !!accountAddress,
      select: (data) => {
        return !data.error;
      },
    }
  );
}
