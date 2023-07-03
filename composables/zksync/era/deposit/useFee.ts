import { computed, ref } from "vue";

import { BigNumber, VoidSigner } from "ethers";
import { L1VoidSigner } from "zksync-web3";
import { L1_RECOMMENDED_MIN_ERC20_DEPOSIT_GAS_LIMIT } from "zksync-web3/build/src/utils";

import type { Token, TokenAmount } from "@/types";
import type { PublicClient } from "@wagmi/core";
import type { Ref } from "vue";
import type { L1Signer, Provider } from "zksync-web3";

import { ETH_L2_ADDRESS } from "@/utils/constants";
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
  const params = {
    to: undefined as string | undefined,
    tokenAddress: undefined as string | undefined,
  };

  const getVoidL1Signer = () => {
    if (!address.value) throw new Error("Address is not available");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const voidSigner = new VoidSigner(address.value, getPublicClient() as any);
    return L1VoidSigner.from(voidSigner, getEraProvider()) as unknown as L1Signer;
  };

  const fee = ref<DepositFeeValues | undefined>();

  const totalFee = computed(() => {
    if (!fee.value) return undefined;

    if (fee.value.l1GasLimit && fee.value.maxFeePerGas && fee.value.maxPriorityFeePerGas) {
      return fee.value.l1GasLimit
        .mul(fee.value.maxFeePerGas)
        .add(fee.value.l1GasLimit.mul(fee.value.maxPriorityFeePerGas))
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

    return await signer.getFullRequiredDepositFee({
      token: ETH_L1_ADDRESS,
      to: params.to,
    });
  };
  const getERC20TransactionFee = async () => {
    return {
      l1GasLimit: BigNumber.from(L1_RECOMMENDED_MIN_ERC20_DEPOSIT_GAS_LIMIT),
    };
  };
  const getGasPrice = async () => {
    return BigNumber.from(await getPublicClient().getGasPrice())
      .mul(110)
      .div(100);
  };
  const estimate = async (to: string, tokenAddress: string) => {
    params.to = to;
    params.tokenAddress = tokenAddress;

    await estimateFee();
  };
  const {
    inProgress,
    error,
    execute: estimateFee,
  } = usePromise(
    async () => {
      if (!feeToken.value) throw new Error("Fee tokens is not available");

      if (params.tokenAddress === feeToken.value?.address) {
        fee.value = await getEthTransactionFee();
      } else {
        fee.value = await getERC20TransactionFee();
      }
      /* It can be either maxFeePerGas or gasPrice */
      if (!fee.value?.maxFeePerGas) {
        fee.value.gasPrice = await getGasPrice();
      }
    },
    { cache: false }
  );

  return {
    fee,
    result: totalFee,
    inProgress,
    error,
    estimateFee: estimate,

    feeToken,
    enoughBalanceToCoverFee,
  };
};
