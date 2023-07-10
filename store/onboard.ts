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

  const getWalletName = async () => {
    if (wagmiClient.connector?.name === "MetaMask") return "MetaMask";
    const provider = await wagmiClient.connector?.getProvider();
    console.log(provider?.session?.peer?.metadata?.name);
    // TODO: Figure out how to get wallet name in WalletConnect v2
    return undefined;
  };

  const account = ref(ethereumClient.getAccount());
  const network = ref(ethereumClient.getNetwork());
  const connectorName = ref(wagmiClient.connector?.name);
  const walletName = ref<string | undefined>(getWalletName());
  const web3modal = new Web3Modal(
    {
      projectId: env.walletConnectProjectID,
      enableNetworkView: false,
      enableAccountView: true,
      themeMode: selectedColorMode.value,
    },
    ethereumClient
  );
  web3modal.setDefaultChain(selectedEthereumNetwork.value);
  ethereumClient.watchAccount(async (updatedAccount) => {
    // There is a bug in @wagmi/core@0.10.11 or @web3modal/ethereum@^2.3.7
    // On page update or after using `ethereumClient.disconnect` method
    // the account state is replaced with "connecting" state
    if (updatedAccount.status === "connecting" && !updatedAccount.connector) {
      return;
    }
    account.value = updatedAccount;
    connectorName.value = wagmiClient.connector?.name;
    walletName.value = getWalletName();
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
