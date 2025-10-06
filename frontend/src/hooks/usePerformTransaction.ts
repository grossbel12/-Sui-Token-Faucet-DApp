import {
  useSuiClient,
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import type { Transaction } from "@mysten/sui/transactions";
import type { SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";
import { useMutation } from "@tanstack/react-query";

export function usePerformTransaction() {
  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const mutation = useMutation({
    mutationFn: performTransaction,
  });

  async function performTransaction({
    transaction,
    onSignAndExecute,
    onTransactionWait,
  }: {
    transaction: Transaction;
    onSignAndExecute?: (
      res: SuiSignAndExecuteTransactionOutput
    ) => Promise<void>;
    onTransactionWait?: (res: SuiTransactionBlockResponse) => Promise<void>;
  }) {
    if (!currentAccount) throw new Error("Wallet is not connected!");

    await signAndExecuteTransactionMutation.mutateAsync(
      {
        transaction,
        chain: `sui:testnet`,
      },
      {
        onSuccess: async (res) => {
          await onSignAndExecute?.(res);
          suiClient
            .waitForTransaction({ digest: res.digest })
            .then(async (res) => {
              await onTransactionWait?.(res);
            });
        },
      }
    );
  }

  return mutation;
}
