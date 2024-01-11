import { useStorage } from "@vueuse/core";
import { decodeEventLog } from "viem";

import ZkSyncContractInterface from "zksync-web3/abi/IZkSync.json";

import type { FeeEstimationParams } from "@/composables/zksync/useFee";
import type { TransactionDestination } from "@/store/destinations";
import type { TokenAmount } from "@/types";
import type { Hash } from "@/types";

import { useOnboardStore } from "@/store/onboard";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { useZkSyncWalletStore } from "@/store/zksync/wallet";

export type TransactionInfo = {
  type: FeeEstimationParams["type"] | "deposit";
  token: TokenAmount;
  from: { address: string; destination: TransactionDestination };
  to: { address: string; destination: TransactionDestination };
  transactionHash: string;
  timestamp: string;
  info: {
    toTransactionHash?: string;
    expectedCompleteTimestamp?: string;
    completed: boolean;
  };
};

export const ESTIMATED_DEPOSIT_DELAY = 15 * 60 * 1000; // 15 minutes
export const WITHDRAWAL_DELAY = 24 * 60 * 60 * 1000; // 24 hours

export const useZkSyncTransactionStatusStore = defineStore("zkSyncTransactionStatus", () => {
  const onboardStore = useOnboardStore();
  const providerStore = useZkSyncProviderStore();
  const { eraNetwork } = storeToRefs(providerStore);

  const storageSavedTransactions = useStorage<{ [networkKey: string]: TransactionInfo[] }>(
    "zksync-bridge-transactions",
    {}
  );
  const savedTransactions = computed<TransactionInfo[]>({
    get: () => {
      return storageSavedTransactions.value[eraNetwork.value.key] || [];
    },
    set: (transactions: TransactionInfo[]) => {
      storageSavedTransactions.value[eraNetwork.value.key] = transactions;
    },
  });
  const saveTransaction = (transaction: TransactionInfo) => {
    savedTransactions.value = [...savedTransactions.value, transaction];
  };

  const getDepositL2TransactionHash = async (l1TransactionHash: string) => {
    const publicClient = onboardStore.getPublicClient();
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: l1TransactionHash as Hash,
    });
    for (const log of transaction.logs) {
      try {
        const { args, eventName } = decodeEventLog({
          abi: ZkSyncContractInterface.abi,
          data: log.data,
          topics: log.topics,
        });
        if (eventName === "NewPriorityRequest") {
          return (args as { txHash: Hash }).txHash;
        }
      } catch {
        // ignore failed decoding
      }
    }
    throw new Error("No L2 transaction hash found");
  };
  const updateDepositStatus = async (transaction: TransactionInfo) => {
    const transactionHash = await getDepositL2TransactionHash(transaction.transactionHash);
    const transactionReceipt = await providerStore.requestProvider().getTransactionReceipt(transactionHash);
    if (!transactionReceipt) return transaction;
    transaction.info.toTransactionHash = transactionHash;
    transaction.info.completed = true;
    return transaction;
  };
  const getWithdrawalStatus = async (transaction: TransactionInfo) => {
    const isFinalized = await useZkSyncWalletStore()
      .getL1VoidSigner()
      ?.isWithdrawalFinalized(transaction.transactionHash)
      .catch(() => false);
    transaction.info.completed = isFinalized;
    return transaction;
  };
  const getTransferStatus = async (transaction: TransactionInfo) => {
    const transactionReceipt = await providerStore.requestProvider().getTransactionReceipt(transaction.transactionHash);
    if (!transactionReceipt) return transaction;
    transaction.info.completed = true;
    return transaction;
  };
  const waitForCompletion = async (transaction: TransactionInfo) => {
    if (transaction.info.completed) return transaction;
    if (transaction.type === "deposit") {
      transaction = await updateDepositStatus(transaction);
    } else if (transaction.type === "withdrawal") {
      transaction = await getWithdrawalStatus(transaction);
    } else if (transaction.type === "transfer") {
      transaction = await getTransferStatus(transaction);
    }
    if (!transaction.info.completed) {
      const timeoutByType: Record<TransactionInfo["type"], number> = {
        deposit: 15_000,
        withdrawal: 60_000,
        transfer: 2_000,
      };
      await new Promise((resolve) => setTimeout(resolve, timeoutByType[transaction.type]));
      transaction = await waitForCompletion(transaction);
    }
    return transaction;
  };

  return {
    savedTransactions,
    saveTransaction,
    waitForCompletion,
  };
});
