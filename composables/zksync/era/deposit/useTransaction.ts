import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/era/deposit/ConfirmTransactionModal.vue";
import type { DepositFeeValues } from "@/composables/zksync/era/deposit/useFee";
import type { L1Signer } from "zksync-web3";

import { formatError } from "@/utils/formatters";

export default (getL1Signer: () => Promise<L1Signer | undefined>) => {
  const status = ref<"not-started" | "processing" | "waiting-for-signature" | "done">("not-started");
  const error = ref<Error | undefined>();
  const ethTransactionHash = ref<string | undefined>();

  const commitTransaction = async (transaction: ConfirmationModalTransaction, fee: DepositFeeValues) => {
    try {
      error.value = undefined;

      status.value = "processing";
      const wallet = await getL1Signer();
      if (!wallet) throw new Error("Wallet is not available");

      status.value = "waiting-for-signature";
      const overrides = {
        gasPrice: fee.gasPrice,
        gasLimit: fee.l1GasLimit,
        maxFeePerGas: fee.maxFeePerGas,
        maxPriorityFeePerGas: fee.maxPriorityFeePerGas,
      };
      if (overrides.gasPrice && overrides.maxFeePerGas) {
        overrides.gasPrice = undefined;
      }
      const depositResponse = await wallet.deposit({
        to: transaction.to,
        token: transaction.token.address,
        amount: transaction.amount,
        l2GasLimit: fee.l2GasLimit,
        overrides,
      });

      ethTransactionHash.value = depositResponse.hash;
      status.value = "done";
      return depositResponse;
    } catch (err) {
      error.value = formatError(err as Error);
      status.value = "not-started";
    }
  };

  return {
    status,
    error,
    ethTransactionHash,
    commitTransaction,
  };
};
