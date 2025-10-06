import {
  useAccounts,
  useDisconnectWallet,
  useResolveSuiNSName,
  useSwitchAccount,
} from "@mysten/dapp-kit";
import type { WalletAccount } from "@mysten/wallet-standard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { formatAddress } from "@mysten/sui/utils";
import { CheckIcon } from "lucide-react";
import { SuiIcon } from "./ui/icons";

type AccountDropdownMenuProps = {
  currentAccount: WalletAccount;
};

export function AccountDropdownMenu({
  currentAccount,
}: AccountDropdownMenuProps) {
  const { mutate: disconnectWallet } = useDisconnectWallet();

  const { data: domain } = useResolveSuiNSName(
    currentAccount.label ? null : currentAccount.address
  );
  const accounts = useAccounts();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"}>
          {currentAccount.label ??
            domain ??
            formatAddress(currentAccount.address)}
          <SuiIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {accounts.map((account) => (
          <AccountDropdownMenuItem
            key={account.address}
            account={account}
            active={currentAccount.address === account.address}
          />
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => disconnectWallet()}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type AccountDropdownMenuItemProps = {
  account: WalletAccount;
  active?: boolean;
};

function AccountDropdownMenuItem({
  account,
  active,
}: AccountDropdownMenuItemProps) {
  const { mutate: switchAccount } = useSwitchAccount();
  const { data: domain } = useResolveSuiNSName(
    account.label ? null : account.address
  );

  return (
    <DropdownMenuItem onSelect={() => switchAccount({ account })}>
      {account.label ?? domain ?? formatAddress(account.address)}{" "}
      {active && <CheckIcon />}
    </DropdownMenuItem>
  );
}
