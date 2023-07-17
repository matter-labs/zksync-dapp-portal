import { Alchemy, BigNumber, Network, TokenBalanceType } from "alchemy-sdk";
import { defineStore, storeToRefs } from "pinia";

import type { TokenBalance } from "alchemy-sdk";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { ETH_L1_ADDRESS } from "@/utils/constants";
import { checksumAddress } from "@/utils/formatters";
import { retry } from "@/utils/helpers";

export const useEthereumBalanceStore = defineStore("ethereumBalance", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const {
    result: balance,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise(
    async () => {
      if (!account.value.address) throw new Error("Account is not available");

      const alchemy = new Alchemy({
        network: selectedEthereumNetwork.value.id === 1 ? Network.ETH_MAINNET : Network.ETH_GOERLI,
      });
      const balances: TokenBalance[] = [];
      const fetchBalances = async (pageKey?: string) => {
        const result = await alchemy.core.getTokenBalances(account.value.address!, {
          type: TokenBalanceType.ERC20,
          pageKey,
        });
        balances.push(
          ...result.tokenBalances.map((token) => ({
            ...token,
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
      } as TokenBalance);
      return balances;
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
