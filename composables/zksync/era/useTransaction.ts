import { useMemoize } from "@vueuse/core";

import type { BigNumberish } from "ethers";
import type { Provider, Signer } from "zksync-web3";

import { ETH_L1_ADDRESS, ETH_L2_ADDRESS } from "@/utils/constants";
import { formatError } from "@/utils/formatters";

type TransactionParams = {
  type: "transfer" | "withdrawal";
  to: string;
  tokenAddress: string;
  amount: BigNumberish;
};

export default (getSigner: () => Promise<Signer | undefined>, getProvider: () => Provider) => {
  const status = ref<"not-started" | "processing" | "waiting-for-signature" | "done">("not-started");
  const error = ref<Error | undefined>();
  const transactionHash = ref<string | undefined>();

  const retrieveBridgeAddresses = useMemoize(() => getProvider().getDefaultBridgeAddresses());

  const commitTransaction = async (
    transaction: TransactionParams,
    fee: { gasPrice: BigNumberish; gasLimit: BigNumberish }
  ) => {
    try {
      error.value = undefined;

      status.value = "processing";
      const signer = await getSigner();
      if (!signer) throw new Error("Era Signer is not available");

      const getRequiredBridgeAddress = async () => {
        if (transaction.tokenAddress === ETH_L2_ADDRESS) return undefined;
        const bridgeAddresses = await retrieveBridgeAddresses();
        return bridgeAddresses.erc20L2;
      };

      status.value = "waiting-for-signature";
      const tx = await signer[transaction.type === "transfer" ? "transfer" : "withdraw"]({
        to: transaction.to,
        token: transaction.tokenAddress === ETH_L2_ADDRESS ? ETH_L1_ADDRESS : transaction.tokenAddress,
        amount: transaction.amount,
        bridgeAddress: transaction.type === "withdrawal" ? await getRequiredBridgeAddress() : undefined,
        overrides: {
          gasPrice: fee.gasPrice,
          gasLimit: fee.gasLimit,
        },
      });

      transactionHash.value = tx.hash;
      status.value = "done";

      return tx;
    } catch (err) {
      error.value = formatError(err as Error);
      status.value = "not-started";
    }
  };

  return {
    status,
    error,
    transactionHash,
    commitTransaction,
  };
};
