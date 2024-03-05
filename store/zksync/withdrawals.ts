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
    if (!eraNetwork.value.withdrawalFinalizerApi)
      throw new Error(`Withdrawal Finalizer API is not available on ${eraNetwork.value.name}`);
    if (!eraNetwork.value.blockExplorerApi)
      throw new Error(`Block Explorer API is not available on ${eraNetwork.value.name}`);
    const withdrawals: Api.Response.Finalizer_Withdrawal[] = await $fetch(
      `${eraNetwork.value.withdrawalFinalizerApi}/withdrawals/${account.value.address}?limit=100`
    );
    for (const withdrawal of withdrawals) {
      const transactionFromStorage = transactionStatusStore.getTransaction(withdrawal.tx_hash);
      if (transactionFromStorage) {
        if (withdrawal.status === "Finalized" && !transactionFromStorage.info.completed) {
          transactionStatusStore.updateTransactionData(withdrawal.tx_hash, {
            ...transactionFromStorage,
            info: {
              ...transactionFromStorage.info,
              completed: true,
            },
          });
        }
        continue;
      }

      const transactionTransfers: Api.Response.Collection<Api.Response.Transfer> = await $fetch(
        `${eraNetwork.value.blockExplorerApi}/transactions/${withdrawal.tx_hash}/transfers?limit=100&page=1`
      );
      const transfers = transactionTransfers.items.map(mapApiTransfer);
      const withdrawalTransfer = transfers.find((e) => e.type === "withdrawal" && e.token && e.amount);
      if (!withdrawalTransfer) continue;
      if (new Date(withdrawalTransfer.timestamp).getTime() < Date.now() - FETCH_TIME_LIMIT) break;
      const transactionDetails = await retry(() =>
        providerStore.requestProvider().getTransactionDetails(withdrawal.tx_hash)
      );

      transactionStatusStore.saveTransaction({
        type: "withdrawal",
        transactionHash: withdrawal.tx_hash,
        timestamp: withdrawalTransfer.timestamp,
        token: {
          ...withdrawalTransfer.token!,
          amount: withdrawalTransfer.amount!,
        },
        from: {
          address: withdrawalTransfer.from,
          destination: destinations.value.era,
        },
        to: {
          address: withdrawalTransfer.to,
          destination: destinations.value.ethereum,
        },
        info: {
          expectedCompleteTimestamp: new Date(
            new Date(withdrawalTransfer.timestamp).getTime() + WITHDRAWAL_DELAY
          ).toISOString(),
          completed: withdrawal.status === "Finalized",
          withdrawalFinalizationAvailable: transactionDetails.status === "verified",
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
    if (!isConnected.value || !eraNetwork.value.blockExplorerApi || !eraNetwork.value.withdrawalFinalizerApi) {
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
