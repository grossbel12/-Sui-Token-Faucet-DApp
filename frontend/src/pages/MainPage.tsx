import { ConnectButton } from "@/components/ConnectButton";
import { EstimatedBalance } from "@/components/EstimatedBalance";
import { GetTokensButton } from "@/components/GetTokensButton";
import { TopUpFaucetButton } from "@/components/TopUpFaucetButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function MainPage() {
  return (
    <div className="@container">
      <div className="mx-auto @3xl:w-[48rem] @3xl:px-0 p-4 gap-y-8 relative flex flex-col items-center">
        <div className="flex flex-wrap gap-2">
          <ConnectButton />
          <GetTokensButton />
          <TopUpFaucetButton />
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-sm">Estimated balance</div>
          <EstimatedBalance />
        </div>
      </div>
    </div>
  );
}
