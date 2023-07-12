import { configureChains, createConfig, getPublicClient, getWalletClient } from "@wagmi/core";
import { zkSync, zkSyncTestnet } from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { defineStore, storeToRefs } from "pinia";

import useColorMode from "@/composables/useColorMode";
import useObservable from "@/composables/useObservable";

import { useRuntimeConfig } from "#imports";
import { l1Networks, useNetworkStore } from "@/store/network";

const extendedChains = [...Object.values(l1Networks), zkSync, zkSyncTestnet];
const { public: env } = useRuntimeConfig();

export const useOnboardStore = defineStore("onboard", () => {
  const { selectedColorMode } = useColorMode();
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const { publicClient } = configureChains(extendedChains, [
    w3mProvider({ projectId: env.walletConnectProjectID }),
    publicProvider(),
  ]);
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
  const connectorName = ref(wagmiClient.connector?.name);
  const walletName = ref<string | undefined>();
  const identifyWalletName = async () => {
    const provider = await wagmiClient.connector?.getProvider();
    const name = provider?.session?.peer?.metadata?.name;

    if (!name && wagmiClient.connector?.name !== "WalletConnect") {
      walletName.value = wagmiClient.connector?.name.replace(/ Wallet$/, "").trim();
    } else {
      walletName.value = name?.replace(/ Wallet$/, "").trim();
    }
  };
  identifyWalletName();
  const web3modal = new Web3Modal(
    {
      projectId: env.walletConnectProjectID,
      enableNetworkView: false,
      enableAccountView: true,
      themeMode: selectedColorMode.value,
      explorerRecommendedWalletIds: [
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
        "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
        "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
        "1aa28414c95f5024133faf5766d376bb9c853c280d158cd3e22dc2b7b0a95a2d",
        "7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26",
      ],

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
    account.value = updatedAccount;
    connectorName.value = wagmiClient.connector?.name;
    identifyWalletName();
  });
  ethereumClient.watchNetwork((updatedNetwork) => {
    network.value = updatedNetwork;
  });
  web3modal.subscribeModal((state) => {
    if (!state.open && !account.value.isConnected) {
      disconnect();
    }
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
    return walletNetworkId === selectedEthereumNetwork.value.id;
  });
  const switchNetworkById = async (chainId: number, networkName = selectedEthereumNetwork.value.name) => {
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
      await switchNetworkById(selectedEthereumNetwork.value.id);
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

  const getWallet = async (chainId: number | undefined = selectedEthereumNetwork.value.id) => {
    const client = await getWalletClient(chainId ? { chainId } : undefined);
    if (!client) throw new Error("Wallet is not available");

    return client;
  };

  return {
    account: computed(() => account.value),
    network: computed(() => network.value),
    isConnectingWallet: computed(() => account.value.isReconnecting || account.value.isConnecting),
    connectorName,
    walletName,
    openModal,
    disconnect,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
    switchNetworkById,

    getEthereumProvider: () => publicClient({ chainId: selectedEthereumNetwork.value.id }),
    getWallet,
    getPublicClient: () => getPublicClient({ chainId: selectedEthereumNetwork.value.id }),

    subscribeOnAccountChange,
  };
});
