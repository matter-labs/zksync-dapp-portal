import { defineStore, storeToRefs } from "pinia";

import type { Hash } from "@/types";
import type { EraTransfer } from "@/utils/zksync/era/mappers";

import { useOnboardStore } from "@/store/onboard";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { useEraTransfersHistoryStore } from "@/store/zksync/era/transfersHistory";
import { useEraWalletStore } from "@/store/zksync/era/wallet";

export type TransferWithStatus = EraTransfer & {
  isCompleted: boolean;
  expectedCompletionTimestamp: string;
};

export const useEraTransferStatusesStore = defineStore("eraTransferStatuses", () => {
  const onboardStore = useOnboardStore();
  const eraTransfersHistoryStore = useEraTransfersHistoryStore();
  const eraWalletStore = useEraWalletStore();
  const eraTokensStore = useEraTokensStore();
  const { account } = storeToRefs(onboardStore);
  const { transfers } = storeToRefs(eraTransfersHistoryStore);
  const { tokens } = storeToRefs(eraTokensStore);

  const checkWithdrawalStatus = async (transfer: EraTransfer) => {
    if (!account.value.address) throw new Error("Account is not available");

    return (
      eraWalletStore
        .getL1VoidSigner()
        ?.isWithdrawalFinalized(transfer.transactionHash as Hash)
        .catch(() => false) ?? false
    );
  };
  const { result: recentWithdrawals, execute: checkRecentWithdrawals } = usePromise<TransferWithStatus[]>(
    async () => {
      await eraTransfersHistoryStore.requestRecentTransfers();

      const withdrawalDelay = 24 * 60 * 60 * 1000; //24h
      const minTimestamp = Date.now() - withdrawalDelay * 2;
      const recentTransfers = transfers.value.filter(
        (transfer) => transfer.type === "withdrawal" && new Date(transfer.timestamp).getTime() > minTimestamp
      );
      const transfersWithStatus = await Promise.all(
        recentTransfers.map(async (transfer): Promise<TransferWithStatus> => {
          const isCompleted = await checkWithdrawalStatus(transfer);
          return {
            ...transfer,
            isCompleted,
            expectedCompletionTimestamp: new Date(
              new Date(transfer.timestamp).getTime() + withdrawalDelay
            ).toISOString(),
          };
        })
      );
      return transfersWithStatus;
    },
    { cache: 30000 }
  );

  return {
    recentWithdrawals: computed(
      () =>
        recentWithdrawals.value?.map((e) => ({
          ...e,
          token: e.token ? tokens.value?.[e.token.address] ?? e.token : undefined,
        })) ?? []
    ),
    checkRecentWithdrawals,
  };
});
