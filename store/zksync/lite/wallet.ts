import { watch } from "vue";

import { BigNumber, VoidSigner } from "ethers";
import { ethers } from "ethers";
import { defineStore, storeToRefs } from "pinia";
import { RemoteWallet, Wallet } from "zksync";

import type { ZkSyncLiteTokenAmount } from "@/types";
import type { AccountState } from "zksync/build/types";

import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";

export const useLiteWalletStore = defineStore("liteWallet", () => {
  const onboardStore = useOnboardStore();
  const liteProviderStore = useLiteProviderStore();
  const liteTokensStore = useLiteTokensStore();
  const { zkSyncLiteNetwork } = storeToRefs(liteProviderStore);
  const { tokens } = storeToRefs(liteTokensStore);
  const { account, network, walletName } = storeToRefs(onboardStore);

  let wallet: Wallet | undefined = undefined;
  const isAuthorized = ref(false);
  const isRemoteWallet = ref(false);

  const getRemoteWallet = async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");

    /* TODO: Fix Argent connection */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const web3Provider = new ethers.providers.Web3Provider((await onboardStore.getWallet()) as any, "any");
    return (await RemoteWallet.fromEthSigner(web3Provider, provider)) as unknown as Wallet;
  };

  const { execute: getWalletInstanceNoSigner, reset: resetWalletInstanceNoSigner } = usePromise<Wallet>(
    async () => {
      const provider = await liteProviderStore.requestProvider();
      if (!provider) throw new Error("Provider is not available");

      if (!zkSyncLiteNetwork.value.l1Network)
        throw new Error(`L1 network is not available on ${zkSyncLiteNetwork.value.name}`);

      const walletNetworkId = network.value.chain?.id;
      if (walletNetworkId !== zkSyncLiteNetwork.value.l1Network.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const web3Provider = new ethers.providers.Web3Provider(onboardStore.getPublicClient() as any, "any");
        const voidSigner = new VoidSigner(account.value.address!, web3Provider);
        wallet = await Wallet.fromEthSignerNoKeys(voidSigner, provider);
      } else if (walletName.value === "Argent") {
        wallet = await getRemoteWallet();
        isRemoteWallet.value = true;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const web3Provider = new ethers.providers.Web3Provider((await onboardStore.getWallet()) as any, "any");
        wallet = await Wallet.fromEthSignerNoKeys(web3Provider.getSigner(), provider);
      }
      return wallet;
    },
    { cache: false }
  );
  const {
    execute: getWalletInstanceWithSigner,
    reset: resetWalletInstanceWithSigner,
    inProgress: authorizationInProgress,
    error: authorizationError,
  } = usePromise<Wallet>(async () => {
    if (!zkSyncLiteNetwork.value.l1Network)
      throw new Error(`L1 network is not available on ${zkSyncLiteNetwork.value.name}`);

    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== zkSyncLiteNetwork.value.l1Network.id) {
      throw new Error(
        `Incorrect wallet network selected: #${walletNetworkId} (expected: ${zkSyncLiteNetwork.value.l1Network.name} #${zkSyncLiteNetwork.value.l1Network.id})`
      );
    }

    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");

    if (walletName.value === "Argent") {
      wallet = await getRemoteWallet();
      isRemoteWallet.value = true;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const web3Provider = new ethers.providers.Web3Provider((await onboardStore.getWallet()) as any, "any");
      wallet = await Wallet.fromEthSigner(web3Provider.getSigner(), provider);
    }
    return wallet;
  });
  const getWalletInstance = async (withSigner = false) => {
    if (withSigner || wallet?.syncSignerConnected()) {
      await getWalletInstanceWithSigner();
    } else {
      await getWalletInstanceNoSigner();
    }
    if (wallet) {
      isAuthorized.value = isRemoteWallet.value || wallet.syncSignerConnected();
    } else {
      isAuthorized.value = false;
    }
    return wallet;
  };
  const resetWalletInstance = () => {
    wallet = undefined;
    resetWalletInstanceNoSigner();
    resetWalletInstanceWithSigner();
  };
  const getSignerPubKeyHash = async () => {
    const wallet = await getWalletInstance(true);
    if (!wallet) throw new Error("Wallet is not available");
    return isRemoteWallet.value ? await wallet.syncSignerPubKeyHash() : await wallet.signer!.pubKeyHash();
  };

  const {
    result: accountState,
    execute: requestAccountState,
    reset: resetAccountState,
  } = usePromise<AccountState>(async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");

    if (!account.value.address) throw new Error("Account is not available");

    return await provider.getState(account.value.address);
  });

  const balance = computed<ZkSyncLiteTokenAmount[]>(() => {
    if (!accountState.value) {
      return [];
    }
    return Object.entries(tokens.value ?? {}).map(([symbol, token]) => {
      const amount = accountState.value!.committed.balances[symbol] ?? "0";
      return { ...token, amount };
    });
  });
  const allBalancePricesLoaded = computed(
    () => !balance.value.some((e) => e.price === "loading") && !balanceInProgress.value
  );
  const {
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<void>(
    async () => {
      await Promise.all([requestAccountState({ force: true }), liteTokensStore.requestTokens()]);
      if (!accountState.value) throw new Error("Account state is not available");
      if (!tokens.value) throw new Error("Tokens are not available");
    },
    { cache: 30000 }
  );

  const pendingDeposits = computed<ZkSyncLiteTokenAmount[]>(() => {
    if (!accountState.value) {
      return [];
    }
    return Object.entries(tokens.value ?? {})
      .map(([symbol, token]) => {
        const amount = accountState.value!.depositing.balances[symbol]?.amount ?? "0";
        return { ...token, amount };
      })
      .filter(({ amount }) => !BigNumber.from(amount).isZero());
  });

  watch(
    [balance, pendingDeposits],
    ([balances, deposits]) => {
      [...balances, ...deposits].map(({ symbol, amount }) => {
        if (BigNumber.from(amount).isZero()) return;
        liteTokensStore.requestTokenPrice(symbol);
      });
    },
    { immediate: true }
  );

  onboardStore.subscribeOnAccountChange(() => {
    isAuthorized.value = false;
    isRemoteWallet.value = false;
    resetWalletInstance();
    resetAccountState();
    resetBalance();
  });

  return {
    isAuthorized,
    authorizationInProgress,
    authorizationError: computed(() => authorizationError.value),
    authorizeWallet: () => getWalletInstance(true),
    getSignerPubKeyHash,

    isRemoteWallet,
    getWalletInstance,

    accountState,
    requestAccountState,

    balance,
    balanceInProgress: computed(() => balanceInProgress.value),
    balanceError: computed(() => balanceError.value),
    allBalancePricesLoaded,
    requestBalance,

    pendingDeposits,
  };
});
