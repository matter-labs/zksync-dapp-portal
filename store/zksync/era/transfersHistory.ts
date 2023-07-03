import { defineStore, storeToRefs } from "pinia";

import usePaginatedRequest from "@/composables/zksync/era/usePaginatedRequest";

import type { Api } from "@/types";
import type { EraTransfer } from "@/utils/zksync/era/mappers";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { mapApiTransfer } from "@/utils/zksync/era/mappers";

const TRANSACTIONS_FETCH_LIMIT = 25;

export const useEraTransfersHistoryStore = defineStore("eraTransfersHistory", () => {
  const onboardStore = useOnboardStore();
  const eraTokensStore = useEraTokensStore();
  const { eraNetwork } = storeToRefs(useEraProviderStore());
  const { tokens } = storeToRefs(eraTokensStore);
  const { account } = storeToRefs(onboardStore);

  const filterOutDuplicateDepositTransfers = (transfers: EraTransfer[]) => {
    // we need to find all transactions (transfers with same transactionHash)
    // if this transaction has just 2 transfers one of which is type deposit and another one is type transfer and they have same token and amount and to address
    // then we should keep only deposit one
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
      const transferTransfer = transfers.find((e) => e.type === "transfer");
      const depositTransfer = transfers.find((e) => e.type === "deposit");
      if (
        transferTransfer &&
        depositTransfer &&
        depositTransfer.type === "deposit" &&
        transferTransfer.type === "transfer" &&
        depositTransfer.token?.address === transferTransfer.token?.address &&
        depositTransfer.amount === transferTransfer.amount &&
        depositTransfer.to === transferTransfer.to
      ) {
        acc.push(depositTransfer);
        return acc;
      }
      acc.push(...transfers);
      return acc;
    }, [] as EraTransfer[]);
    // sort by date descending
    return filteredTransfers.sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
  };

  const {
    canLoadMore,
    loadNext,
    reset: resetPaginatedRequest,
  } = usePaginatedRequest<Api.Response.Transfer>(() => {
    const url = new URL(`/address/${account.value.address}/transfers`, eraNetwork.value.blockExplorerApi);
    url.searchParams.set("limit", TRANSACTIONS_FETCH_LIMIT.toString());
    return url;
  });
  const transfers = ref<EraTransfer[]>([]);

  const getTransferTokenPrices = (transfers: EraTransfer[]) => {
    transfers.forEach((transfer) => {
      if (transfer.token && tokens.value?.[transfer.token.address]) {
        eraTokensStore.requestTokenPrice(transfer.token.address);
      }
    });
  };

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
      transfers.value = filterOutDuplicateDepositTransfers(mappedTransfers);
      getTransferTokenPrices(mappedTransfers);
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
      transfers.value = filterOutDuplicateDepositTransfers([...transfers.value, ...mappedTransfers]);
      getTransferTokenPrices(mappedTransfers);
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
