import { $fetch } from "ofetch";

import type { Api } from "@/types";

const FETCH_TIME_LIMIT = 31 * 24 * 60 * 60 * 1000; // 31 days

export const useZkSyncWithdrawalsStore = defineStore("zkSyncWithdrawals", () => {
  const onboardStore = useOnboardStore();
  const providerStore = useZkSyncProviderStore();
  const transactionStatusStore = useZkSyncTransactionStatusStore();
  const { account, isConnected } = storeToRefs(onboardStore);
  const { eraNetwork } = storeToRefs(providerStore);
  const { userTransactions } = storeToRefs(transactionStatusStore);
  const { destinations } = storeToRefs(useDestinationsStore());

  const updateWithdrawals = async () => {
    if (!isConnected.value) throw new Error("Account is not available");
    if (!eraNetwork.value.blockExplorerApi)
      throw new Error(`Block Explorer API is not available on ${eraNetwork.value.name}`);

    const responses: Api.Response.Collection<Api.Response.Transfer>[] = await Promise.all([
      $fetch(`${eraNetwork.value.blockExplorerApi}/address/${account.value.address}/transfers?limit=100&page=1`),
      $fetch(`${eraNetwork.value.blockExplorerApi}/address/${account.value.address}/transfers?limit=100&page=2`),
      $fetch(`${eraNetwork.value.blockExplorerApi}/address/${account.value.address}/transfers?limit=100&page=3`),
    ]);
    const withdrawalTransfers = responses
      .map((response) => response.items.map(mapApiTransfer))
      .flat()
      .filter((e) => e.type === "withdrawal");

    for (const withdrawal of withdrawalTransfers) {
      if (!withdrawal.transactionHash) continue;

      const transactionFromStorage = transactionStatusStore.getTransaction(withdrawal.transactionHash);
      if (transactionFromStorage) continue;

      if (new Date(withdrawal.timestamp).getTime() < Date.now() - FETCH_TIME_LIMIT) break;
      const transactionDetails = await retry(() =>
        providerStore.requestProvider().getTransactionDetails(withdrawal.transactionHash!)
      );

      const withdrawalFinalizationAvailable = transactionDetails.status === "verified";
      const isFinalized = withdrawalFinalizationAvailable
        ? await useZkSyncWalletStore()
            .getL1VoidSigner(true)
            ?.isWithdrawalFinalized(withdrawal.transactionHash)
            .catch(() => false)
        : false;

      transactionStatusStore.saveTransaction({
        type: "withdrawal",
        transactionHash: withdrawal.transactionHash,
        timestamp: withdrawal.timestamp,
        token: {
          ...withdrawal.token!,
          amount: withdrawal.amount!,
        },
        from: {
          address: withdrawal.from,
          destination: destinations.value.era,
        },
        to: {
          address: withdrawal.to,
          destination: destinations.value.ethereum,
        },
        info: {
          expectedCompleteTimestamp: new Date(
            new Date(withdrawal.timestamp).getTime() + WITHDRAWAL_DELAY
          ).toISOString(),
          completed: isFinalized,
          withdrawalFinalizationAvailable,
        },
      });
    }
  };

  const withdrawalsAvailableForClaiming = computed(() =>
    userTransactions.value.filter(
      (tx) => tx.type === "withdrawal" && !tx.info.completed && tx.info.withdrawalFinalizationAvailable
    )
  );

  const updateWithdrawalsIfPossible = async () => {
    if (!isConnected.value || !eraNetwork.value.blockExplorerApi) {
      return;
    }
    await updateWithdrawals();
  };
  const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
    updateWithdrawalsIfPossible();
  }, 60_000);

  onboardStore.subscribeOnAccountChange((account) => {
    if (account) {
      resetAutoUpdate();
      updateWithdrawalsIfPossible();
    } else {
      stopAutoUpdate();
    }
  });

  return {
    withdrawalsAvailableForClaiming,
    updateWithdrawals,
    updateWithdrawalsIfPossible,
  };
});
