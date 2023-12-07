import { defineStore, storeToRefs } from "pinia";

import usePaginatedRequest from "@/composables/zksync/era/usePaginatedRequest";

import type { Api } from "@/types";
import type { EraTransfer } from "@/utils/zksync/era/mappers";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { mapApiTransfer } from "@/utils/zksync/era/mappers";

const TRANSACTIONS_FETCH_LIMIT = 50;

export const useEraTransfersHistoryStore = defineStore("eraTransfersHistory", () => {
  const onboardStore = useOnboardStore();
  const eraTokensStore = useEraTokensStore();
  const { eraNetwork } = storeToRefs(useEraProviderStore());
  const { tokens } = storeToRefs(eraTokensStore);
  const { account } = storeToRefs(onboardStore);

  const filterOutDuplicateTransfers = (transfers: EraTransfer[]) => {
    /*
      Currently BE API Deposit and Withdrawal transaction generate 2 logs:
        1 "transfer" and "deposit" or "withdrawal" depending on the type of the transaction.
      We want to remove the "transfer" from the list for user convenience.
    */
    const transactions = transfers.reduce((acc, transfer) => {
      if (!transfer.transactionHash) {
        return acc;
      }
      if (!acc[transfer.transactionHash]) {
        acc[transfer.transactionHash] = [];
      }
      acc[transfer.transactionHash].push(transfer);
      return acc;
    }, {} as Record<string, EraTransfer[]>);

    const filteredTransfers = Object.values(transactions).reduce((acc, transfers) => {
      const transfer = transfers.find((e) => e.type === "transfer");
      const depositOrWithdrawal = transfers.find((e) => e.type === "deposit" || e.type === "withdrawal");
      if (
        transfer &&
        depositOrWithdrawal &&
        depositOrWithdrawal.token?.address === transfer.token?.address &&
        depositOrWithdrawal.amount === transfer.amount &&
        ((depositOrWithdrawal.type === "deposit" && depositOrWithdrawal.to === transfer.to) ||
          (depositOrWithdrawal.type === "withdrawal" && depositOrWithdrawal.from === transfer.from))
      ) {
        acc.push(depositOrWithdrawal);
        return acc;
      }
      acc.push(...transfers);
      return acc;
    }, [] as EraTransfer[]);
    return filteredTransfers.sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
  };

  const {
    canLoadMore,
    loadNext,
    reset: resetPaginatedRequest,
  } = usePaginatedRequest<Api.Response.Transfer>(() => {
    if (!eraNetwork.value.blockExplorerApi)
      throw new Error(`Block Explorer API is not available on ${eraNetwork.value.name}`);

    const url = new URL(`/address/${account.value.address}/transfers`, eraNetwork.value.blockExplorerApi);
    url.searchParams.set("limit", TRANSACTIONS_FETCH_LIMIT.toString());
    return url;
  });
  const transfers = ref<EraTransfer[]>([]);

  const {
    inProgress: recentTransfersRequestInProgress,
    error: recentTransfersRequestError,
    execute: requestRecentTransfers,
    reset: resetRecentTransfersRequest,
    reload: reloadRecentTransfers,
  } = usePromise(
    async () => {
      if (transfers.value.length) {
        resetPaginatedRequest();
      }
      const [response] = await Promise.all([loadNext(), eraTokensStore.requestTokens()]);
      const mappedTransfers = response.items.map((e) => mapApiTransfer(e));
      transfers.value = filterOutDuplicateTransfers(mappedTransfers);
    },
    { cache: 30000 }
  );

  const {
    inProgress: previousTransfersRequestInProgress,
    error: previousTransfersRequestError,
    execute: requestPreviousTransfers,
    reset: resetPreviousTransfersRequest,
  } = usePromise(
    async () => {
      const oldestTransferInTheList = transfers.value[transfers.value.length - 1];
      if (!oldestTransferInTheList) {
        return requestRecentTransfers();
      }
      const [response] = await Promise.all([loadNext(), eraTokensStore.requestTokens()]);
      const mappedTransfers = response.items.map((e) => mapApiTransfer(e));
      transfers.value = filterOutDuplicateTransfers([...transfers.value, ...mappedTransfers]);
    },
    { cache: false }
  );

  onboardStore.subscribeOnAccountChange(() => {
    transfers.value = [];
    resetRecentTransfersRequest();
    resetPreviousTransfersRequest();
    resetPaginatedRequest();
  });

  return {
    transfers: computed(() =>
      transfers.value.map((e) => ({
        ...e,
        token: e.token ? tokens.value?.[e.token.address] ?? e.token : undefined,
      }))
    ),

    recentTransfersRequestInProgress,
    recentTransfersRequestError,
    requestRecentTransfers,
    reloadRecentTransfers,

    canLoadMore,
    previousTransfersRequestInProgress,
    previousTransfersRequestError,
    requestPreviousTransfers,
  };
});
