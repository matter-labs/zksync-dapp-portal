import { watch } from "vue";

import { BigNumber } from "ethers";
import { ethers } from "ethers";
import { $fetch } from "ohmyfetch";
import { defineStore, storeToRefs } from "pinia";
import { L1Signer, Web3Provider } from "zksync-web3";

import type { Api, TokenAmount } from "@/types";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";

export const useEraWalletStore = defineStore("eraWallet", () => {
  const onboardStore = useOnboardStore();
  const eraProviderStore = useEraProviderStore();
  const eraTokensStore = useEraTokensStore();
  const { eraNetwork } = storeToRefs(eraProviderStore);
  const { tokens } = storeToRefs(eraTokensStore);
  const { account, network } = storeToRefs(onboardStore);

  const { execute: getSigner, reset: resetSigner } = usePromise(async () => {
    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== eraNetwork.value.id) {
      throw new Error(
        `Incorrect wallet network selected: #${walletNetworkId} (expected: ${eraNetwork.value.name} #${eraNetwork.value.id})`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const web3Provider = new Web3Provider((await onboardStore.getWallet(eraNetwork.value.id)) as any, "any");
    const eraL2Signer = web3Provider.getSigner();
    return eraL2Signer;
  });
  const { execute: getL1Signer, reset: resetL1Signer } = usePromise(async () => {
    if (!eraNetwork.value.l1Network) throw new Error(`L1 network is not available on ${eraNetwork.value.name}`);

    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== eraNetwork.value.l1Network.id) {
      throw new Error(
        `Incorrect wallet network selected: #${walletNetworkId} (expected: ${eraNetwork.value.l1Network.name} #${eraNetwork.value.l1Network.id})`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const web3Provider = new ethers.providers.Web3Provider((await onboardStore.getWallet()) as any, "any");
    const eraL1Signer = L1Signer.from(web3Provider.getSigner(), eraProviderStore.requestProvider());
    return eraL1Signer;
  });

  const {
    result: accountState,
    execute: requestAccountState,
    reset: resetAccountState,
  } = usePromise<Api.Response.Account | Api.Response.Contract>(async () => {
    if (!account.value.address) throw new Error("Account is not available");

    return await $fetch(`${eraNetwork.value.blockExplorerApi}/address/${account.value.address}`);
  });
  const {
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<void>(
    async () => {
      await Promise.all([requestAccountState({ force: true }), eraTokensStore.requestTokens()]);
      if (!accountState.value) throw new Error("Account state is not available");
      if (!tokens.value) throw new Error("Tokens are not available");
    },
    { cache: 30000 }
  );

  const balance = computed<TokenAmount[]>(() => {
    if (!accountState.value) return [];
    return Object.entries(tokens.value ?? {}).map(([, token]) => {
      const amount = accountState.value?.balances[token.address]?.balance ?? "0";
      return { ...token, amount };
    });
  });
  watch(
    balance,
    (balances) => {
      balances.map((e) => {
        if (BigNumber.from(e.amount).isZero()) return;
        eraTokensStore.requestTokenPrice(e.address);
      });
    },
    { immediate: true }
  );
  const allBalancePricesLoaded = computed(
    () => !balance.value.some((e) => e.price === "loading") && !balanceInProgress.value
  );
  const deductBalance = (tokenAddress: string, amount: string) => {
    if (!balance.value) return;
    const tokenBalance = balance.value.find((balance) => balance.address === tokenAddress);
    if (!tokenBalance) return;
    const newBalance = BigNumber.from(tokenBalance.amount).sub(amount);
    tokenBalance.amount = newBalance.isNegative() ? "0" : newBalance.toString();
  };

  const isCorrectNetworkSet = computed(() => {
    const walletNetworkId = network.value.chain?.id;
    return walletNetworkId === eraNetwork.value.id;
  });
  const {
    inProgress: switchingNetworkInProgress,
    error: switchingNetworkError,
    execute: switchNetwork,
  } = usePromise(
    async () => {
      await onboardStore.switchNetworkById(eraNetwork.value.id, eraNetwork.value.name);
    },
    { cache: false }
  );
  const setCorrectNetwork = async () => {
    await switchNetwork().catch(() => undefined);
  };

  onboardStore.subscribeOnAccountChange(() => {
    resetSigner();
    resetL1Signer();
    resetAccountState();
    resetBalance();
  });

  return {
    getSigner,
    getL1Signer,

    balance,
    balanceInProgress: computed(() => balanceInProgress.value),
    balanceError: computed(() => balanceError.value),
    allBalancePricesLoaded,
    requestBalance,
    deductBalance,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
  };
});
