import { useStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";

import useTimedCache from "@/composables/useTimedCache";

import type { Hash } from "@/types";
import type { Transfer } from "@/utils/mappers";

import { useOnboardStore } from "@/store/onboard";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { useZkSyncTransfersHistoryStore } from "@/store/zksync/transfersHistory";
import { useZkSyncWalletStore } from "@/store/zksync/wallet";

export type TransferWithStatus = Transfer & {
  status: "loading" | "completed" | "not-completed" | "request-failed";
  expectedCompletionTimestamp: string;
};

export const WITHDRAWAL_DELAY = 24 * 60 * 60 * 1000; //24h

let updateCacheCounter = 0;
const checkWithdrawalStatus = useTimedCache<boolean, [transactionHash: string, updateCacheCounter?: number]>(
  async (transactionHash: string) => {
    return (
      useZkSyncWalletStore()
        .getL1VoidSigner()
        ?.isWithdrawalFinalized(transactionHash as Hash)
        .catch(() => false) ?? false
    );
  },
  60000
);
const forceCheckWithdrawalStatus = (transactionHash: string) => {
  updateCacheCounter++;
  return checkWithdrawalStatus(transactionHash, updateCacheCounter);
};

export default () => {
  const eraTransfersHistoryStore = useZkSyncTransfersHistoryStore();
  const { isConnected } = storeToRefs(useOnboardStore());
  const { transfers } = storeToRefs(eraTransfersHistoryStore);
  const { eraNetwork } = storeToRefs(useZkSyncProviderStore());

  const storageCompletedWithdrawals = useStorage<{ [networkKey: string]: string[] }>(
    "completed-zksync-withdrawals",
    {}
  );
  const completedWithdrawals = computed<string[]>({
    get: () => {
      return storageCompletedWithdrawals.value[eraNetwork.value.key] || [];
    },
    set: (withdrawalsTransactionHashes: string[]) => {
      storageCompletedWithdrawals.value[eraNetwork.value.key] = withdrawalsTransactionHashes;
    },
  });

  const withdrawalStatuses = ref({} as { [transactionHash: string]: TransferWithStatus["status"] });
  const recentWithdrawals = computed(() => {
    const minTimestamp = Date.now() - WITHDRAWAL_DELAY * 2;
    return transfers.value
      .filter((transfer) => transfer.type === "withdrawal" && new Date(transfer.timestamp).getTime() > minTimestamp)
      .map((e): TransferWithStatus => {
        const isTransactionCompleted = completedWithdrawals.value.includes(e.transactionHash!);
        const status: TransferWithStatus["status"] = isTransactionCompleted
          ? "completed"
          : withdrawalStatuses.value[e.transactionHash!] ?? "loading";
        return {
          ...e,
          status,
          expectedCompletionTimestamp: new Date(new Date(e.timestamp).getTime() + WITHDRAWAL_DELAY).toISOString(),
        };
      })
      .slice(0, 5);
  });

  const updateWithdrawalStatus = async (transactionHash: string, force = false) => {
    const transfer = recentWithdrawals.value.find((e) => e.transactionHash === transactionHash);
    if (transfer && transfer.status !== "completed") {
      const fn = force ? forceCheckWithdrawalStatus : checkWithdrawalStatus;
      return await fn(transactionHash)
        .then((isCompleted) => {
          withdrawalStatuses.value[transactionHash] = isCompleted ? "completed" : "not-completed";
          if (isCompleted) {
            completedWithdrawals.value = [...completedWithdrawals.value, transactionHash];
          }
        })
        .catch(() => {
          withdrawalStatuses.value[transactionHash] = "request-failed";
        });
    }
  };
  const updateAllWithdrawalStatuses = async () => {
    eraTransfersHistoryStore.requestRecentTransfers();
    for (const withdrawalTransfer of recentWithdrawals.value) {
      await updateWithdrawalStatus(withdrawalTransfer.transactionHash!);
    }
  };
  watch(
    () => recentWithdrawals.value.map((e) => e.transactionHash),
    () => {
      if (!isConnected.value) return;
      if (!eraNetwork.value.blockExplorerApi) return;
      updateAllWithdrawalStatuses();
    },
    { immediate: true }
  );

  return {
    recentWithdrawals,
    updateAllWithdrawalStatuses,
    updateWithdrawalStatus,
  };
};
