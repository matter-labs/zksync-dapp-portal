import { AnkrProvider } from "@ankr.com/ankr.js";
import { Alchemy, BigNumber, TokenBalanceType } from "alchemy-sdk";
import { defineStore, storeToRefs } from "pinia";

import type { Blockchain as AnkrSupportedChains } from "@ankr.com/ankr.js";
import type { Network as AlchemyNetwork } from "alchemy-sdk";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { ETH_L1_ADDRESS } from "@/utils/constants";
import { checksumAddress } from "@/utils/formatters";
import { retry } from "@/utils/helpers";

type L1Balance = {
  contractAddress: string;
  tokenBalance: string;
};

export const useEthereumBalanceStore = defineStore("ethereumBalance", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);
  const { eraNetwork } = storeToRefs(useEraProviderStore());

  const getBalancesWithAlchemy = async (): Promise<L1Balance[]> => {
    if (!account.value.address) throw new Error("Account is not available");
    if (!eraNetwork.value.l1Network) throw new Error(`L1 network is not available on ${eraNetwork.value.name}`);

    const alchemy = new Alchemy({
      network: `eth-${eraNetwork.value.l1Network.network}` as AlchemyNetwork,
    });
    const balances: L1Balance[] = [];
    const fetchBalances = async (pageKey?: string) => {
      const result = await alchemy.core.getTokenBalances(account.value.address!, {
        type: TokenBalanceType.ERC20,
        pageKey,
      });
      balances.push(
        ...result.tokenBalances
          .filter((e) => !e.tokenBalance)
          .map((token) => ({
            tokenBalance: token.tokenBalance!.toString(),
            contractAddress: checksumAddress(token.contractAddress),
          }))
      );
      if (result.pageKey) {
        await fetchBalances(result.pageKey);
      }
    };
    const [ethersBalance] = await Promise.all([
      retry(() => alchemy.core.getBalance(account.value.address!)),
      retry(() => fetchBalances()),
    ]);
    balances.push({
      contractAddress: ETH_L1_ADDRESS,
      tokenBalance: ethersBalance.toString(),
    } as L1Balance);
    return balances;
  };
  const getBalancesWithAnkr = async () => {
    if (!account.value.address) throw new Error("Account is not available");
    if (!eraNetwork.value.l1Network) throw new Error(`L1 network is not available on ${eraNetwork.value.name}`);

    const provider = new AnkrProvider("https://rpc.ankr.com/multichain");
    const balances = await provider.getAccountBalance({
      blockchain: [
        eraNetwork.value.l1Network.network === "mainnet"
          ? "eth"
          : (`eth-${eraNetwork.value.l1Network.network}` as AnkrSupportedChains),
      ],
      walletAddress: account.value.address,
      onlyWhitelisted: false,
    });
    return balances.assets
      .filter((e) => !e.contractAddress)
      .map((e) => ({
        contractAddress: checksumAddress(e.contractAddress!),
        tokenBalance: e.balance,
      }));
  };

  const {
    result: balance,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise(
    async () => {
      return getBalancesWithAnkr().catch(() => getBalancesWithAlchemy());
    },
    { cache: false }
  );

  const deductBalance = (tokenL1Address: string, amount: string) => {
    if (!balance.value) return;
    const tokenBalance = balance.value.find((balance) => balance.contractAddress === tokenL1Address);
    if (!tokenBalance) return;
    const newBalance = BigNumber.from(tokenBalance.tokenBalance).sub(amount);
    tokenBalance.tokenBalance = newBalance.isNegative() ? "0" : newBalance.toString();
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
