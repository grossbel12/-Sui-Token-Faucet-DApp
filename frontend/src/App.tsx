import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/tanstack-query";
import { networkConfig } from "./config/network";
import { ThemeProvider } from "./components/ui/theme-provider";
import { MainPage } from "./pages/MainPage";
import { EnokiClientProvider } from "./components/EnokiClientProvider";
import { enokiClient } from "./config/enoki";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <EnokiClientProvider client={enokiClient}>
            <WalletProvider autoConnect>
              <MainPage />
            </WalletProvider>
          </EnokiClientProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
