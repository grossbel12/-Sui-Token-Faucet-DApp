import { EnokiClient } from "@mysten/enoki";

/* 
  ATTENTION

  For demonstration only!
  Do not use Enoki private key in production frontend!
  
  More information: https://docs.enoki.mystenlabs.com/ts-sdk/sponsored-transactions
*/
export const enokiClient = new EnokiClient({
  apiKey: import.meta.env.VITE_ENOKI_PRIVATE_API_KEY,
});
