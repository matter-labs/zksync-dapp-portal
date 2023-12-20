import { computed, ref } from "vue";

import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { L1_RECOMMENDED_MIN_ERC20_DEPOSIT_GAS_LIMIT } from "zksync-web3/build/src/utils";

import useTimedCache from "@/composables/useTimedCache";

import type { Token, TokenAmount } from "@/types";
import type { PublicClient } from "@wagmi/core";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";
import type { L1Signer } from "zksync-web3";

import { retry } from "@/utils/helpers";
import { calculateFee } from "@/utils/helpers";

export type DepositFeeValues = {
  maxFeePerGas?: BigNumber;
  maxPriorityFeePerGas?: BigNumber;
  gasPrice?: BigNumber;
  baseCost?: BigNumber;
  l1GasLimit: BigNumber;
  l2GasLimit?: BigNumber;
};

export default (
  tokens: Ref<Token[]>,
  balances: Ref<TokenAmount[] | undefined>,
  getL1VoidSigner: () => L1Signer,
  getPublicClient: () => PublicClient
) => {
  let params = {
    to: undefined as string | undefined,
    tokenAddress: undefined as string | undefined,
  };

  const fee = ref<DepositFeeValues | undefined>();
  const recommendedBalance = ref<BigNumberish | undefined>();

  const totalFee = computed(() => {
    if (!fee.value) return undefined;

    if (fee.value.l1GasLimit && fee.value.maxFeePerGas && fee.value.maxPriorityFeePerGas) {
      return fee.value.l1GasLimit
        .mul(fee.value.maxFeePerGas)
        .add(fee.value.baseCost || "0")
        .toString();
    } else if (fee.value.l1GasLimit && fee.value.gasPrice) {
      return calculateFee(fee.value.l1GasLimit, fee.value.gasPrice).toString();
    }
    return undefined;
  });

  const feeToken = computed(() => {
    return tokens.value.find((e) => e.address === ETH_TOKEN.l1Address);
  });
  const enoughBalanceToCoverFee = computed(() => {
    if (!feeToken.value || !balances.value || inProgress.value) {
      return true;
    }
    const feeTokenBalance = balances.value.find((e) => e.address === feeToken.value!.address);
    if (!feeTokenBalance) return true;
    if (totalFee.value && BigNumber.from(totalFee.value).gt(feeTokenBalance.amount)) {
      return false;
    }
    return true;
  });

  const getEthTransactionFee = async () => {
    const signer = getL1VoidSigner();
    if (!signer) throw new Error("Signer is not available");

    return retry(async () => {
      try {
        return await signer.getFullRequiredDepositFee({
          token: ETH_TOKEN.l1Address!,
          to: params.to,
        });
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("Not enough balance for deposit.")) {
          const match = err.message.match(/([\d\\.]+) ETH/);
          if (feeToken.value && match?.length) {
            const ethAmount = match[1].split(" ")?.[0];
            recommendedBalance.value = parseEther(ethAmount);
            return;
          }
        }
        throw err;
      }
    });
  };
  const getERC20TransactionFee = async () => {
    return {
      l1GasLimit: BigNumber.from(L1_RECOMMENDED_MIN_ERC20_DEPOSIT_GAS_LIMIT),
    };
  };
  const getGasPrice = async () => {
    return BigNumber.from(await retry(() => getPublicClient().getGasPrice()))
      .mul(110)
      .div(100);
  };
  const {
    inProgress,
    error,
    execute: executeEstimateFee,
    reset: resetEstimateFee,
  } = usePromise(
    async () => {
      recommendedBalance.value = undefined;
      if (!feeToken.value) throw new Error("Fee tokens is not available");

      if (params.tokenAddress === feeToken.value?.address) {
        fee.value = await getEthTransactionFee();
      } else {
        fee.value = await getERC20TransactionFee();
      }
      /* It can be either maxFeePerGas or gasPrice */
      if (fee.value && !fee.value?.maxFeePerGas) {
        fee.value.gasPrice = await getGasPrice();
      }
    },
    { cache: false }
  );
  const cacheEstimateFee = useTimedCache<void, [typeof params]>(() => {
    resetEstimateFee();
    return executeEstimateFee();
  }, 1000 * 8);

  return {
    fee,
    result: totalFee,
    inProgress,
    error,
    recommendedBalance,
    estimateFee: async (to: string, tokenAddress: string) => {
      params = {
        to,
        tokenAddress,
      };
      await cacheEstimateFee(params);
    },
    resetFee: () => {
      fee.value = undefined;
    },

    feeToken,
    enoughBalanceToCoverFee,
  };
};
