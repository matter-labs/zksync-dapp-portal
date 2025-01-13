import { AnkrProvider } from "@ankr.com/ankr.js";
import { utils } from "zksync-ethers";

import { l1Networks } from "@/data/networks";

import type { TokenAmount } from "@/types";
import type { Blockchain as AnkrSupportedChains } from "@ankr.com/ankr.js";

export const useEthereumBalanceStore = defineStore("ethereumBalance", () => {
  const portalRuntimeConfig = usePortalRuntimeConfig();

  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);
  const { eraNetwork } = storeToRefs(useZkSyncProviderStore());

  const {
    result: balance,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<TokenAmount[]>(
    async () => {
      if (!account.value.address) throw new Error("Account is not available");
      if (!eraNetwork.value.l1Network) throw new Error(`L1 network is not available on ${eraNetwork.value.name}`);
      if (!portalRuntimeConfig.ankrToken) throw new Error("Ankr token is not available");

      const ankrProvider = new AnkrProvider(`https://rpc.ankr.com/multichain/${portalRuntimeConfig.ankrToken}`);
      const networkIdToAnkr = new Map<number, AnkrSupportedChains | "eth_sepolia">([
        [l1Networks.mainnet.id, "eth"],
        [l1Networks.sepolia.id, "eth_sepolia"],
      ]);
      if (!networkIdToAnkr.has(eraNetwork.value.l1Network.id)) {
        throw new Error(`Ankr does not support ${eraNetwork.value.l1Network.name}`);
      }
      const balances = await ankrProvider.getAccountBalance({
        blockchain: [networkIdToAnkr.get(eraNetwork.value.l1Network.id)!] as AnkrSupportedChains[],
        walletAddress: account.value.address,
        onlyWhitelisted: false,
      });
      return balances.assets
        .filter((e) => e.contractAddress || e.tokenType === "NATIVE")
        .map((e) => {
          return {
            address: e.tokenType === "NATIVE" ? utils.ETH_ADDRESS : checksumAddress(e.contractAddress!),
            symbol: e.tokenSymbol,
            name: e.tokenName,
            decimals: e.tokenDecimals,
            iconUrl: e.thumbnail,
            price: e.tokenPrice === "0" ? undefined : parseFloat(e.tokenPrice),
            amount: e.balanceRawInteger,
          } as TokenAmount;
        });
    },
    { cache: false }
  );

  const deductBalance = (tokenL1Address: string, amount: string) => {
    if (!balance.value) return;
    const tokenBalance = balance.value.find((balance) => balance.address === tokenL1Address);
    if (!tokenBalance) return;
    const newBalance = BigInt(tokenBalance.amount) - BigInt(amount);
    tokenBalance.amount = newBalance < 0n ? "0" : newBalance.toString();
  };

  onboardStore.subscribeOnAccountChange(() => {
    resetBalance();
  });

  return {
    balance,
    balanceInProgress,
    balanceError,
    requestBalance,

    deductBalance,
  };
});
