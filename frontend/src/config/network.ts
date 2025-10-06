import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import {
  TESTNET_FAUCET_OBJECT_ID,
  TESTNET_FAUCET_PACKAGE_ID,
} from "./constants";

export const {
  networkConfig,
  useNetworkConfig,
  useNetworkVariable,
  useNetworkVariables,
} = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      faucetPackageId: TESTNET_FAUCET_PACKAGE_ID,
      faucetId: TESTNET_FAUCET_OBJECT_ID,
    },
  },
});
