import { Button } from "./ui/button";
import { DownloadIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useIsAlreadyClaimedQuery } from "@/hooks/useIsAlreadyClaimedQuery";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";
import { useNetworkVariables } from "@/config/network";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function GetTokensButton() {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();
  const networkVariables = useNetworkVariables();
  const currentAccount = useCurrentAccount();

  const isAlreadyClaimedQuery = useIsAlreadyClaimedQuery({
    faucetId: networkVariables.faucetId,
    accountAddress: currentAccount?.address,
  });

  function onClick() {
    const tx = new Transaction();

    tx.moveCall({
      target: `${networkVariables.faucetPackageId}::faucet::get_tokes`,
      arguments: [tx.object(networkVariables.faucetId)],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${networkVariables.faucetPackageId}::faucet::get_tokes`,
        ],
        allowedAddresses: undefined,
      },
      onTransactionWait: async () => {
        await queryClient.refetchQueries();
      },
    });
  }

  if (!currentAccount) return null;

  if (isAlreadyClaimedQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (isAlreadyClaimedQuery.isError)
    return (
      <Button variant={"destructive"}>
        Error <XCircleIcon />
      </Button>
    );

  if (isAlreadyClaimedQuery.data) return <Button disabled>Claimed</Button>;

  return (
    <Button onClick={onClick} disabled={performTransactionMutation.isPending}>
      Get tokens <DownloadIcon />
    </Button>
  );
}
