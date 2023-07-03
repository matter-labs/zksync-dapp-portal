import { BigNumber } from "ethers";

import IERC20 from "zksync-web3/abi/IERC20.json";

import type { Hash } from "@/types";
import type { PublicClient, WalletClient } from "@wagmi/core";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";

import { ETH_L1_ADDRESS } from "@/utils/constants";

export default (
  accountAddress: Ref<string | undefined>,
  tokenAddress: Ref<string | undefined>,
  getContractAddress: () => Promise<string | undefined>,
  getWallet: () => Promise<WalletClient>,
  getPublicClient: () => PublicClient
) => {
  const {
    result,
    inProgress,
    error,
    execute: getAllowance,
    reset,
  } = usePromise(
    async () => {
      if (!accountAddress.value) throw new Error("Account address is not available");

      const contractAddress = await getContractAddress();
      if (!contractAddress) throw new Error("Contract address is not available");

      const publicClient = getPublicClient();
      const allowance = (await publicClient.readContract({
        address: tokenAddress.value as Hash,
        abi: IERC20.abi,
        functionName: "allowance",
        args: [accountAddress.value, contractAddress],
      })) as bigint;
      return BigNumber.from(allowance);
    },
    { cache: false }
  );

  const setAllowance = async (amount: BigNumberish) => {
    if (!accountAddress.value) throw new Error("Account address is not available");

    const contractAddress = await getContractAddress();
    if (!contractAddress) throw new Error("Contract address is not available");

    const wallet = await getWallet();
    const txHash = await wallet.writeContract({
      address: tokenAddress.value as Hash,
      abi: IERC20.abi,
      functionName: "approve",
      args: [contractAddress, amount.toString()],
    });
    return txHash;
  };

  const requestAllowance = async () => {
    if (accountAddress.value && tokenAddress.value && tokenAddress.value !== ETH_L1_ADDRESS) {
      await getAllowance();
    } else {
      reset();
    }
  };

  watch(
    [accountAddress, tokenAddress],
    () => {
      requestAllowance();
    },
    { immediate: true }
  );

  return {
    result: computed(() => result.value),
    inProgress: computed(() => inProgress.value),
    error: computed(() => error.value),
    requestAllowance,

    setAllowance,
  };
};
