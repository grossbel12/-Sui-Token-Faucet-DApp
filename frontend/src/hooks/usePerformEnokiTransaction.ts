import {
  useSuiClient,
  useSignTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import type { SignedTransaction } from "@mysten/wallet-standard";
import { useEnokiClient } from "./useEnokiClient";
import { toBase64 } from "@mysten/sui/utils";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { useMutation } from "@tanstack/react-query";

export function usePerformEnokiTransaction() {
  const enokiClient = useEnokiClient();

  const signTransactionMutation = useSignTransaction();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const mutation = useMutation({
    mutationFn: performTransaction,
  });

  async function performTransaction({
    transaction,
    enoki,
    onSign,
    onExecute,
    onTransactionWait,
  }: {
    transaction: Transaction;
    enoki: {
      allowedMoveCallTargets: string[] | undefined;
      allowedAddresses: string[] | undefined;
    };
    onSign?: (res: SignedTransaction) => Promise<void>;
    onExecute?: () => Promise<void>;
    onTransactionWait?: (res: SuiTransactionBlockResponse) => Promise<void>;
  }) {
    if (!currentAccount) throw new Error("Wallet is not connected!");

    const txBytes = await transaction.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    const sponsoredTxBytes = await enokiClient.createSponsoredTransaction({
      network: "testnet",
      transactionKindBytes: toBase64(txBytes),
      sender: currentAccount.address,
      ...enoki,
    });

    await signTransactionMutation.mutateAsync(
      {
        transaction: sponsoredTxBytes.bytes,
        chain: `sui:testnet`,
      },
      {
        onSuccess: async (res) => {
          await onSign?.(res);

          await enokiClient
            .executeSponsoredTransaction({
              signature: res.signature,
              digest: sponsoredTxBytes.digest,
            })
            .then(async (res) => {
              await onExecute?.();

              suiClient
                .waitForTransaction({ digest: res.digest })
                .then(async (res) => {
                  await onTransactionWait?.(res);
                });
            });
        },
      }
    );
  }

  return mutation;
}
