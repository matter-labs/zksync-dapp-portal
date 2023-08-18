import { computed, ref } from "vue";

import { BigNumber, ethers, VoidSigner } from "ethers";
import { L1VoidSigner } from "zksync-web3";
import { L1_RECOMMENDED_MIN_ERC20_DEPOSIT_GAS_LIMIT } from "zksync-web3/build/src/utils";

import useTimedCache from "@/composables/useTimedCache";

import type { Token, TokenAmount } from "@/types";
import type { PublicClient } from "@wagmi/core";
import type { Ref } from "vue";
import type { L1Signer, Provider } from "zksync-web3";

import { ETH_L2_ADDRESS } from "@/utils/constants";
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
  address: Ref<string | undefined>,
  tokens: Ref<{ [tokenSymbol: string]: Token } | undefined>,
  balances: Ref<TokenAmount[]>,
  getEraProvider: () => Provider,
  getPublicClient: () => PublicClient
) => {
  let params = {
    to: undefined as string | undefined,
    tokenAddress: undefined as string | undefined,
  };

  const getVoidL1Signer = () => {
    if (!address.value) throw new Error("Address is not available");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const web3Provider = new ethers.providers.Web3Provider(getPublicClient() as any, "any");
    const voidSigner = new VoidSigner(address.value, web3Provider);
    return L1VoidSigner.from(voidSigner, getEraProvider()) as unknown as L1Signer;
  };

  const fee = ref<DepositFeeValues | undefined>();
  const recommendedBalance = ref<string | undefined>();

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
    return tokens.value?.[ETH_L2_ADDRESS];
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

  const getEthTransactionFee = async () => {
    const signer = getVoidL1Signer();
    if (!signer) throw new Error("Signer is not available");

    return retry(async () => {
      try {
        return await signer.getFullRequiredDepositFee({
          token: ETH_L1_ADDRESS,
          to: params.to,
        });
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("Not enough balance for deposit.")) {
          const match = err.message.match(/([\d\\.]+) ETH/);
          if (feeToken.value && match?.length) {
            const ethAmount = match[1].split(" ")?.[0];
            recommendedBalance.value = ethAmount;
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
