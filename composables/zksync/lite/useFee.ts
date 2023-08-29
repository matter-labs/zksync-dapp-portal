import { ref } from "vue";

import { BigNumber } from "ethers";
import { closestPackableTransactionFee } from "zksync";

import type { ZkSyncLiteToken, ZkSyncLiteTokenAmount } from "@/types";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";
import type { RestProvider } from "zksync";
import type { IncomingTxFeeType } from "zksync/build/types";

import { isTransactionFeePayedSeparately } from "@/utils/zksync/lite/helpers";

export type FeeEstimationParams = {
  type: IncomingTxFeeType;
  to: string;
  symbol: string;
};

export default (
  requestProvider: () => Promise<RestProvider | undefined>,
  tokens: Ref<{ [tokenSymbol: string]: ZkSyncLiteToken } | undefined>,
  feeTokenAddress: Ref<string | undefined>,
  balances: Ref<ZkSyncLiteTokenAmount[]>
) => {
  let estimationPromise: Promise<void> | undefined;
  const result = ref<BigNumberish | undefined>();
  const inProgress = ref(false);
  const error = ref<Error | undefined>();
  const prevParams = ref("");

  const tokensAvailableForFee = computed(() => {
    if (!balances.value) {
      return;
    }
    return balances.value.filter((e) => e.enabledForFees);
  });
  const feeToken = computed(() => {
    if (!feeTokenAddress.value || !tokens.value) {
      return;
    }
    const foundToken = Object.entries(tokens.value).find(([, token]) => token.address === feeTokenAddress.value)?.[1];
    if (!foundToken?.enabledForFees) {
      return tokens.value["ETH"];
    }
    return foundToken;
  });
  const enoughBalanceToCoverFee = computed(() => {
    if (!feeToken.value || inProgress.value) {
      return true;
    }
    const feeTokenBalance = balances.value.find((e) => e.address === feeToken.value!.address);
    if (!feeTokenBalance) return true;
    if (result.value && BigNumber.from(result.value).gt(feeTokenBalance.amount)) {
      return false;
    }
    return true;
  });

  const estimate = async (params: FeeEstimationParams[], from: string, feeSymbol: string) => {
    const stringified = JSON.stringify({ params, from, feeSymbol });
    if (!estimationPromise || prevParams.value !== stringified) {
      prevParams.value = stringified;
      estimationPromise = estimateFee(params, from, feeSymbol);
    }
    await estimationPromise
      .then(() => {
        estimationPromise = undefined;
      })
      .catch(() => {
        estimationPromise = undefined;
      });
  };
  const estimateFee = async (params: FeeEstimationParams[], from: string, feeSymbol: string) => {
    try {
      inProgress.value = true;
      result.value = undefined;
      error.value = undefined;

      const provider = await requestProvider();
      if (!provider) throw new Error("Provider is not available");
      let fee: BigNumber | undefined = undefined;
      const feePaidSeparately = isTransactionFeePayedSeparately(params, feeSymbol);
      if (params.length === 1 && !feePaidSeparately) {
        const { type, to, symbol } = params[0];
        fee = (await provider.getTransactionFee(type, to, symbol)).totalFee;
      } else {
        if (feePaidSeparately) {
          fee = await provider.getTransactionsBatchFee(
            [...params.map((e) => e.type), "Transfer"],
            [...params.map((e) => e.to), from],
            feeSymbol
          );
        } else {
          fee = await provider.getTransactionsBatchFee(
            params.map((e) => e.type),
            params.map((e) => e.to),
            feeSymbol
          );
        }
      }
      result.value = fee ? closestPackableTransactionFee(fee).toString() : undefined;
    } catch (err) {
      error.value = err as Error;
    } finally {
      inProgress.value = false;
    }
  };

  return {
    result,
    inProgress,
    error,
    estimateFee: estimate,
    resetFee: () => {
      result.value = undefined;
      error.value = undefined;
    },

    feeToken,
    tokensAvailableForFee,
    enoughBalanceToCoverFee,
  };
};
