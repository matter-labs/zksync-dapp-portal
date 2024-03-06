import {
  getAccount,
  getPublicClient,
  getWalletClient,
  reconnect,
  switchChain,
  disconnect as walletDisconnect,
  watchAccount,
} from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi";

import useColorMode from "@/composables/useColorMode";
import useObservable from "@/composables/useObservable";

import { confirmedSupportedWallets, disabledWallets } from "@/data/wallets";
import { wagmiConfig } from "@/data/wagmi";

export const useOnboardStore = defineStore("onboard", () => {
  const { public: env } = useRuntimeConfig();
  const { selectedColorMode } = useColorMode();
  const { selectedNetwork, l1Network } = storeToRefs(useNetworkStore());

  reconnect(wagmiConfig);

  const account = ref(getAccount(wagmiConfig));
  const connectingWalletError = ref<string | undefined>();
  const connectorName = ref(account.value.connector?.name);
  const walletName = ref<string | undefined>();
  const walletNotSupported = computed(() => {
    if (!walletName.value) return false;
    return !confirmedSupportedWallets.find((wallet) => wallet === walletName.value);
  });
  const identifyWalletName = async () => {
    const { connector } = getAccount(wagmiConfig);
    const provider = await connector?.getProvider?.();
    const name = (provider as any)?.session?.peer?.metadata?.name;
    if (!name && connector?.name !== "WalletConnect") {
      walletName.value = connector?.name.replace(/ Wallet$/, "").trim();
    } else {
      walletName.value = name?.replace(/ Wallet$/, "").trim();
    }

    if (walletName.value && connector) {
      const isWalletDisabled = !!disabledWallets.find((wallet) => wallet === walletName.value);
      if (isWalletDisabled) throw new Error(`Unfortunately ${walletName.value} wallet is not supported at the moment!`);
    }
  };

  const web3modal = createWeb3Modal({
    wagmiConfig,
    projectId: env.walletConnectProjectID,
    excludeWalletIds: ["bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6"],
    featuredWalletIds: [
      "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
      "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
      "1aa28414c95f5024133faf5766d376bb9c853c280d158cd3e22dc2b7b0a95a2d",
    ],
    termsConditionsUrl: "https://zksync.io/terms",
    privacyPolicyUrl: "https://zksync.io/privacy",
    themeMode: selectedColorMode.value,
  });

  watchAccount(wagmiConfig, {
    onChange: async (updatedAccount) => {
      try {
        await identifyWalletName();
        account.value = updatedAccount;
        connectorName.value = updatedAccount.connector?.name;
      } catch (err) {
        disconnect();
        const error = formatError(err as Error);
        if (error) {
          connectingWalletError.value = error.message;
        }
      }
    },
  });
  watch(selectedColorMode, (colorMode) => {
    web3modal.setThemeMode(colorMode);
  });

  const openModal = () => web3modal.open();
  const disconnect = () => {
    const { connector } = getAccount(wagmiConfig);
    if (!connector) return;
    walletDisconnect(wagmiConfig, { connector });
  };

  const isCorrectNetworkSet = computed(() => {
    const walletNetworkId = account.value.chain?.id;
    return walletNetworkId === l1Network.value?.id;
  });
  const switchNetworkById = async (chainId: number, networkName?: string) => {
    try {
      return await switchChain(wagmiConfig, { chainId });
    } catch (err) {
      if (err instanceof Error && err.message.includes("does not support programmatic chain switching")) {
        throw new Error(`Please switch network manually to "${networkName}" in your ${walletName.value} wallet`);
      }
      throw err;
    }
  };
  const {
    inProgress: switchingNetworkInProgress,
    error: switchingNetworkError,
    execute: switchNetwork,
  } = usePromise(
    async () => {
      if (!l1Network.value) throw new Error(`L1 network is not available on ${selectedNetwork.value.name}`);
      return await switchNetworkById(l1Network.value.id);
    },
    { cache: false }
  );
  const setCorrectNetwork = async () => {
    return await switchNetwork().catch(() => undefined);
  };

  const { subscribe: subscribeOnAccountChange, notify: notifyOnAccountChange } = useObservable<string | undefined>();
  watch(
    () => account.value.address,
    () => {
      notifyOnAccountChange(account.value.address);
    }
  );

  const getWallet = async (chainId: number | undefined = l1Network.value?.id) => {
    const client = await getWalletClient(wagmiConfig, chainId ? { chainId } : undefined);
    if (!client) throw new Error("Wallet is not available");

    return client;
  };

  return {
    account: computed(() => account.value),
    isConnected: computed(() => !!account.value.address),
    isConnectingWallet: computed(() => account.value.isReconnecting || account.value.isConnecting),
    connectingWalletError,
    connectorName,
    walletName,
    walletNotSupported,
    openModal,
    disconnect,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
    switchNetworkById,

    getWallet,
    getPublicClient: () => {
      if (!l1Network.value) throw new Error(`L1 network is not available on ${selectedNetwork.value.name}`);
      const publicClient = getPublicClient(wagmiConfig, { chainId: l1Network.value?.id });
      if (!publicClient) {
        throw new Error("Public client is not available");
      }
      return publicClient;
    },

    subscribeOnAccountChange,
  };
});
