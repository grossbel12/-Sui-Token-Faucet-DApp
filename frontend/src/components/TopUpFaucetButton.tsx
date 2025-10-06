import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { UploadIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { toMist } from "@/lib/sui";
import { usePerformTransaction } from "@/hooks/usePerformTransaction";
import { useNetworkVariables } from "@/config/network";
import { useCurrentAccount } from "@mysten/dapp-kit";

const formSchema = z.object({
  amount: z.coerce.number<number>().min(0.01),
});

export function TopUpFaucetButton() {
  const performTransactionMutation = usePerformTransaction();
  const queryClient = useQueryClient();
  const networkVariables = useNetworkVariables();
  const currentAccount = useCurrentAccount();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.01,
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    const tx = new Transaction();
    const coin = tx.splitCoins(tx.gas, [toMist(variables.amount)]);

    tx.moveCall({
      target: `${networkVariables.faucetPackageId}::faucet::top_up_faucet`,
      arguments: [tx.object(networkVariables.faucetId), tx.object(coin)],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      onSignAndExecute: async () => {
        dialog.onClose();
      },
      onTransactionWait: async () => {
        await queryClient.refetchQueries();
      },
    });
  }

  if (!currentAccount) return null;

  return (
    <>
      <Button onClick={dialog.onOpen}>
        Top Up Faucet <UploadIcon />
      </Button>

      <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Faucet</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={performTransactionMutation.isPending}
                type="submit"
              >
                Top Up
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
