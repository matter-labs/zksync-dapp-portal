import { fetchSigner } from "@wagmi/core";
import { Contract } from "ethers";
import { IERC20 } from "zksync-web3/build/src/utils";

import type { Provider } from "@wagmi/core";
import type { BigNumber, BigNumberish, ContractTransaction, Signer } from "ethers";
import type { Ref } from "vue";

import { ETH_L1_ADDRESS } from "@/utils/constants";

export default (
  accountAddress: Ref<string | undefined>,
  tokenAddress: Ref<string | undefined>,
  getContractAddress: () => Promise<string | undefined>,
  getEthereumProvider: () => Provider
) => {
  const getContractInstance = async (providerOrSigner: Signer | Provider) => {
    if (!tokenAddress.value) throw new Error("Token is not available");

    return new Contract(tokenAddress.value, IERC20, providerOrSigner);
  };

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

      const erc20contract = await getContractInstance(getEthereumProvider());
      return (await erc20contract.allowance(accountAddress.value, contractAddress)) as BigNumber;
    },
    { cache: false }
  );

  const setAllowance = async (amount: BigNumberish) => {
    if (!accountAddress.value) throw new Error("Account address is not available");

    const contractAddress = await getContractAddress();
    if (!contractAddress) throw new Error("Contract address is not available");

    const signer = await fetchSigner();
    if (!signer) throw new Error("Signer is not available");

    const erc20contract = await getContractInstance(signer);
    return (await erc20contract.approve(contractAddress, amount)) as ContractTransaction;
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
