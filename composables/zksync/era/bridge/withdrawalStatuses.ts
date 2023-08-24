import { storeToRefs } from "pinia";

import useTimedCache from "@/composables/useTimedCache";

import type { Hash } from "@/types";
import type { EraTransfer } from "@/utils/zksync/era/mappers";

import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";

export type TransferWithStatus = EraTransfer & {
  status: "loading" | "completed" | "not-completed" | "request-failed";
  expectedCompletionTimestamp: string;
};

const WITHDRAWAL_DELAY = 24 * 60 * 60 * 1000; //24h

let updateCacheCounter = 0;
const checkWithdrawalStatus = useTimedCache<boolean, [transactionHash: string, updateCacheCounter?: number]>(
  async (transactionHash: string) => {
    return (
      useEraWalletStore()
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
  const eraTransfersHistoryStore = useEraTransfersHistoryStore();
  const { transfers } = storeToRefs(eraTransfersHistoryStore);

  const transferStatuses = ref({} as { [transactionHash: string]: TransferWithStatus["status"] });
  const recentWithdrawals = computed(() => {
    const minTimestamp = Date.now() - WITHDRAWAL_DELAY * 2;
    return transfers.value
      .filter((transfer) => transfer.type === "withdrawal" && new Date(transfer.timestamp).getTime() > minTimestamp)
      .map(
        (e): TransferWithStatus => ({
          ...e,
          status: transferStatuses.value[e.transactionHash!] ?? "loading",
          expectedCompletionTimestamp: new Date(new Date(e.timestamp).getTime() + WITHDRAWAL_DELAY).toISOString(),
        })
      );
  });

  const updateWithdrawalStatus = (transactionHash: string, force = false) => {
    if (transactionHash && transferStatuses.value[transactionHash] !== "completed") {
      const fn = force ? forceCheckWithdrawalStatus : checkWithdrawalStatus;
      fn(transactionHash)
        .then((isCompleted) => {
          transferStatuses.value[transactionHash] = isCompleted ? "completed" : "not-completed";
        })
        .catch(() => {
          transferStatuses.value[transactionHash] = "request-failed";
        });
    }
  };
  const updateAllWithdrawalStatuses = () => {
    eraTransfersHistoryStore.requestRecentTransfers();
    recentWithdrawals.value
      .map((e) => e.transactionHash)
      .forEach((transactionHash) => {
        updateWithdrawalStatus(transactionHash!);
      });
  };
  watch(
    () => recentWithdrawals.value.map((e) => e.transactionHash),
    () => {
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
