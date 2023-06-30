import { configureChains, createConfig } from "@wagmi/core";
import { zkSync, zkSyncTestnet } from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { defineStore, storeToRefs } from "pinia";

import useColorMode from "@/composables/useColorMode";
import useObservable from "@/composables/useObservable";

import { useRuntimeConfig } from "#imports";
import { chains, useNetworkStore } from "@/store/network";

const extendedChains = [...chains, zkSync, zkSyncTestnet];
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

  const getWalletName = () => {
    if (wagmiClient.connector?.name === "WalletConnect" || wagmiClient.connector?.name === "WalletConnectLegacy") {
      /* TODO: Figure our how to properly get wallet name from WalletConnect */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return wagmiClient.data?.provider?.provider?.connector?.peerMeta?.name;
    }
    return wagmiClient.connector?.name;
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
  ethereumClient.watchNetwork((updatedNetwork) => (network.value = updatedNetwork));
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

  const blockExplorerUrl = computed(() => {
    if (selectedEthereumNetwork.value.network === "mainnet") {
      return "https://etherscan.io";
    }
    return `https://${selectedEthereumNetwork.value.network}.etherscan.io`;
  });

  const { subscribe: subscribeOnAccountChange, notify: notifyOnAccountChange } = useObservable<string | undefined>();
  watch(
    () => account.value.address,
    () => {
      notifyOnAccountChange(account.value.address);
    }
  );

  const getEIP1193Provider = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // WC2 const signer = (await fetchSigner()) as any;
    const signer = undefined;
    if (!signer) throw new Error("Signer is not available");

    const provider = Object.assign(signer.provider, signer.provider.provider, {
      request: signer.provider.request ?? signer.provider.provider.request,
      send: signer.provider.send ?? signer.provider.provider.send,
      sendAsync: signer.provider.sendAsync ?? signer.provider.provider.sendAsync,
      formatChainId: signer.provider.formatChainId ?? signer.provider.provider.formatChainId,
    });
    return provider;
  };

  return {
    account: computed(() => account.value),
    network: computed(() => network.value),
    isConnectingWallet: computed(() => account.value.isReconnecting || account.value.isConnecting),
    walletName,
    openModal,
    disconnect,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
    switchNetworkById,

    blockExplorerUrl,
    getEthereumProvider: () => publicClient({ chainId: selectedEthereumNetwork.value.id }),
    getEIP1193Provider,

    subscribeOnAccountChange,
  };
});
