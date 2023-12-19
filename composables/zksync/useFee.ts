import { BigNumber } from "ethers";

import useTimedCache from "@/composables/useTimedCache";

import type { Token, TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";
import type { Provider } from "zksync-web3";

import { retry } from "@/utils/helpers";
import { calculateFee } from "@/utils/helpers";

export type FeeEstimationParams = {
  type: "transfer" | "withdrawal";
  from: string;
  to: string;
  tokenAddress: string;
};

export default (
  getProvider: () => Provider,
  tokens: Ref<{ [tokenSymbol: string]: Token } | undefined>,
  balances: Ref<TokenAmount[]>
) => {
  let params: FeeEstimationParams | undefined = undefined;

  const gasLimit = ref<BigNumberish | undefined>();
  const gasPrice = ref<BigNumberish | undefined>();

  const totalFee = computed(() => {
    if (!gasLimit.value || !gasPrice.value) return undefined;
    return calculateFee(gasLimit.value, gasPrice.value).toString();
  });

  const feeToken = computed(() => {
    return tokens.value?.[ETH_TOKEN.address];
  });
  const enoughBalanceToCoverFee = computed(() => {
    if (!feeToken.value || inProgress.value) {
      return true;
    }
    const feeTokenBalance = balances.value.find((e) => e.address === feeToken.value!.address);
    if (!feeTokenBalance) return true;
    if (totalFee.value && BigNumber.from(totalFee.value).gt(feeTokenBalance.amount)) {
      return false;
    }
    return true;
  });

  const {
    inProgress,
    error,
    execute: executeEstimateFee,
    reset: resetEstimateFee,
  } = usePromise(
    async () => {
      if (!params) throw new Error("Params are not available");

      const provider = getProvider();
      const [price, limit] = await Promise.all([
        retry(() => provider.getGasPrice()),
        retry(() => {
          if (!params) throw new Error("Params are not available");
          return provider[params.type === "transfer" ? "estimateGasTransfer" : "estimateGasWithdraw"]({
            from: params.from,
            to: params.to,
            token: params.tokenAddress === ETH_TOKEN.address ? ETH_TOKEN.l1Address! : params.tokenAddress,
            amount: "1",
          });
        }),
      ]);
      gasPrice.value = price;
      gasLimit.value = limit;
    },
    { cache: false }
  );
  const cacheEstimateFee = useTimedCache<void, [FeeEstimationParams]>(() => {
    resetEstimateFee();
    return executeEstimateFee();
  }, 1000 * 8);

  return {
    gasLimit,
    gasPrice,
    result: totalFee,
    inProgress,
    error,
    estimateFee: async (estimationParams: FeeEstimationParams) => {
      params = estimationParams;
      await cacheEstimateFee(params);
    },
    resetFee: () => {
      gasLimit.value = undefined;
      gasPrice.value = undefined;
    },

    feeToken,
    enoughBalanceToCoverFee,
  };
};
