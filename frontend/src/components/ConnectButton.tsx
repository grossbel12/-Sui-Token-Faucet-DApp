import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "./ui/button";
import { SuiIcon } from "./ui/icons";
import { AccountDropdownMenu } from "./AccountDropdownMenu";

export function ConnectButton() {
  const currentAccount = useCurrentAccount();

  if (!currentAccount)
    return (
      <ConnectModal
        trigger={
          <Button>
            Connect Wallet
            <SuiIcon />
          </Button>
        }
      />
    );

  return <AccountDropdownMenu currentAccount={currentAccount} />;
}
