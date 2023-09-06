import { configureChains, createConfig, getPublicClient, getWalletClient } from "@wagmi/core";
import { zkSync, zkSyncTestnet } from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { defineStore, storeToRefs } from "pinia";

import useColorMode from "@/composables/useColorMode";
import useNetworks from "@/composables/useNetworks";
import useObservable from "@/composables/useObservable";

import type { EraNetwork } from "@/data/networks";
import type { Chain } from "@wagmi/core";

import { useRuntimeConfig } from "#imports";
import { confirmedSupportedWallets, disabledWallets } from "@/data/wallets";
import { useNetworkStore } from "@/store/network";

export const useOnboardStore = defineStore("onboard", () => {
  const { eraNetworks, zkSyncLiteNetworks } = useNetworks();
  const useExistingEraChain = (network: EraNetwork) => {
    const existingNetworks = [zkSync, zkSyncTestnet];
    return existingNetworks.find((existingNetwork) => existingNetwork.id === network.id);
  };
  const createEraChain = (network: EraNetwork) => {
    return {
      id: network.id,
      name: network.name,
      network: network.key,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: { http: [network.rpcUrl] },
        public: { http: [network.rpcUrl] },
      },
    };
  };
  const getAllChains = () => {
    const chains: Chain[] = [];
    const addUniqueChain = (chain: Chain) => {
      if (!chains.find((existingChain) => existingChain.id === chain.id)) {
        chains.push(chain);
      }
    };
    for (const network of zkSyncLiteNetworks) {
      if (network.l1Network) {
        addUniqueChain(network.l1Network);
      }
    }
    for (const network of eraNetworks) {
      if (network.l1Network) {
        addUniqueChain(network.l1Network);
      }
      addUniqueChain(useExistingEraChain(network) ?? createEraChain(network));
    }

    return chains;
  };

  const extendedChains = [...getAllChains()];

  const { public: env } = useRuntimeConfig();
  const { selectedColorMode } = useColorMode();
  const { selectedNetwork, l1Network } = storeToRefs(useNetworkStore());

  const { publicClient } = configureChains(extendedChains, [publicProvider()]);
  const wagmiClient = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({
      projectId: env.walletConnectProjectID,
      chains: extendedChains,
    }),
    publicClient,
  });
  const ethereumClient = new EthereumClient(wagmiClient, extendedChains);

  const account = ref(ethereumClient.getAccount());
  const network = ref(ethereumClient.getNetwork());
  const connectingWalletError = ref<string | undefined>();
  const connectorName = ref(wagmiClient.connector?.name);
  const walletName = ref<string | undefined>();
  const walletNotSupported = computed(() => {
    if (!walletName.value || !wagmiClient.connector) return false;
    const isWalletNotSupported = !confirmedSupportedWallets.find(
      (wallet) => wallet.walletName === walletName.value && wallet.type === wagmiClient.connector?.id
    );
    return isWalletNotSupported;
  });
  const identifyWalletName = async () => {
    const provider = await wagmiClient.connector?.getProvider();
    const name = provider?.session?.peer?.metadata?.name;

    if (!name && wagmiClient.connector?.name !== "WalletConnect") {
      walletName.value = wagmiClient.connector?.name.replace(/ Wallet$/, "").trim();
    } else {
      walletName.value = name?.replace(/ Wallet$/, "").trim();
    }

    if (walletName.value && wagmiClient.connector) {
      const isWalletDisabled = !!disabledWallets.find(
        (wallet) => wallet.walletName === walletName.value && wallet.type === wagmiClient.connector?.id
      );
      if (isWalletDisabled) throw new Error(`Unfortunately ${walletName.value} wallet is not supported at the moment!`);
    }
  };
  identifyWalletName();
  const web3modal = new Web3Modal(
    {
      projectId: env.walletConnectProjectID,
      enableNetworkView: false,
      enableAccountView: false,
      themeMode: selectedColorMode.value,
      explorerRecommendedWalletIds: [
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
        "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
        "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
        "1aa28414c95f5024133faf5766d376bb9c853c280d158cd3e22dc2b7b0a95a2d",
        "7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26",
      ],
      explorerExcludedWalletIds: ["bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6"],

      termsOfServiceUrl: "https://zksync.io/terms",
      privacyPolicyUrl: "https://zksync.io/privacy",
    },
    ethereumClient
  );
  ethereumClient.watchAccount(async (updatedAccount) => {
    // There is a bug in @wagmi/core@0.10.11 or @web3modal/ethereum@^2.3.7
    // On page update or after using `ethereumClient.disconnect` method
    // the account state is replaced with "connecting" state
    if (updatedAccount.status === "connecting" && !updatedAccount.connector) {
      return;
    }
    try {
      await identifyWalletName();
      account.value = updatedAccount;
      connectorName.value = wagmiClient.connector?.name;
    } catch (err) {
      disconnect();
      const error = formatError(err as Error);
      if (error) {
        connectingWalletError.value = error.message;
      }
    }
  });
  ethereumClient.watchNetwork((updatedNetwork) => {
    network.value = updatedNetwork;
  });
  watch(selectedColorMode, (colorMode) => {
    web3modal.setTheme({
      themeMode: colorMode,
    });
  });

  const openModal = () => web3modal.openModal();
  const disconnect = () => {
    ethereumClient.disconnect();
  };

  const isCorrectNetworkSet = computed(() => {
    const walletNetworkId = network.value.chain?.id;
    return walletNetworkId === l1Network.value?.id;
  });
  const switchNetworkById = async (chainId: number, networkName?: string) => {
    try {
      await ethereumClient.switchNetwork({ chainId });
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
      await switchNetworkById(l1Network.value.id);
    },
    { cache: false }
  );
  const setCorrectNetwork = async () => {
    await switchNetwork().catch(() => undefined);
  };

  const { subscribe: subscribeOnAccountChange, notify: notifyOnAccountChange } = useObservable<string | undefined>();
  watch(
    () => account.value.address,
    () => {
      notifyOnAccountChange(account.value.address);
    }
  );

  const getWallet = async (chainId: number | undefined = l1Network.value?.id) => {
    const client = await getWalletClient(chainId ? { chainId } : undefined);
    if (!client) throw new Error("Wallet is not available");

    return client;
  };

  return {
    account: computed(() => account.value),
    network: computed(() => network.value),
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
      return getPublicClient({ chainId: l1Network.value?.id });
    },

    subscribeOnAccountChange,
  };
});
