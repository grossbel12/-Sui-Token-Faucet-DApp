import { SuiIcon } from "./ui/icons";
import { LoaderCircle } from "lucide-react";
import { fromMist } from "@/lib/sui";
import { useEstimatedBalanceQuery } from "@/hooks/useEstimatedBalanceQuery";
import { useNetworkVariables } from "@/config/network";

export function EstimatedBalance() {
  const networkVariables = useNetworkVariables();
  const estimatedBalanceQuery = useEstimatedBalanceQuery({
    faucetId: networkVariables.faucetId,
  });

  if (estimatedBalanceQuery.isPending)
    return <LoaderCircle className="animate-spin size-6" />;
  if (estimatedBalanceQuery.isError || !estimatedBalanceQuery.data)
    return <div className="text-4xl font-bold">Smth. went wrong ⛔</div>;

  return (
    <div className="text-4xl font-bold">
      {fromMist(estimatedBalanceQuery.data)}{" "}
      <SuiIcon className="inline sixe-6" />
    </div>
  );
}
