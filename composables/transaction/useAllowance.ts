import { BigNumber } from "ethers";
import IERC20 from "zksync-ethers/abi/IERC20.json";

import type { Hash } from "@/types";
import type { BigNumberish } from "ethers";

export default (
  accountAddress: Ref<string | undefined>,
  tokenAddress: Ref<string | undefined>,
  getContractAddress: () => Promise<string | undefined>
) => {
  const { getPublicClient, getWallet } = useOnboardStore();
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
      const allowance = (await publicClient!.readContract({
        address: tokenAddress.value as Hash,
        abi: IERC20,
        functionName: "allowance",
        args: [accountAddress.value, contractAddress],
      })) as bigint;
      return BigNumber.from(allowance);
    },
    { cache: false }
  );

  const requestAllowance = async () => {
    if (accountAddress.value && tokenAddress.value && tokenAddress.value !== ETH_TOKEN.l1Address) {
      await getAllowance();
    } else {
      reset();
    }
  };

  let approvalAmount: BigNumberish | undefined;
  const setAllowanceStatus = ref<"not-started" | "processing" | "waiting-for-signature" | "sending" | "done">(
    "not-started"
  );
  const setAllowanceTransactionHash = ref<Hash | undefined>();
  const {
    result: setAllowanceReceipt,
    inProgress: setAllowanceInProgress,
    error: setAllowanceError,
    execute: executeSetAllowance,
    reset: resetExecuteSetAllowance,
  } = usePromise(
    async () => {
      try {
        setAllowanceStatus.value = "processing";
        if (!accountAddress.value) throw new Error("Account address is not available");

        const contractAddress = await getContractAddress();
        if (!contractAddress) throw new Error("Contract address is not available");

        const wallet = await getWallet();

        setAllowanceStatus.value = "waiting-for-signature";
        setAllowanceTransactionHash.value = await wallet.writeContract({
          address: tokenAddress.value as Hash,
          abi: IERC20,
          functionName: "approve",
          args: [contractAddress, approvalAmount!.toString()],
        });

        setAllowanceStatus.value = "sending";
        const receipt = await getPublicClient().waitForTransactionReceipt({
          hash: setAllowanceTransactionHash.value!,
          onReplaced: (replacement) => {
            setAllowanceTransactionHash.value = replacement.transaction.hash;
          },
        });
        await requestAllowance();

        setAllowanceStatus.value = "done";
        return receipt;
      } catch (err) {
        setAllowanceStatus.value = "not-started";
        throw err;
      }
    },
    { cache: false }
  );
  const setAllowance = async (amount: BigNumberish) => {
    approvalAmount = amount;
    await executeSetAllowance();
  };
  const resetSetAllowance = () => {
    approvalAmount = undefined;
    setAllowanceStatus.value = "not-started";
    setAllowanceTransactionHash.value = undefined;
    resetExecuteSetAllowance();
  };

  watch(
    [accountAddress, tokenAddress],
    () => {
      requestAllowance();
      resetSetAllowance();
    },
    { immediate: true }
  );

  return {
    result: computed(() => result.value),
    inProgress: computed(() => inProgress.value),
    error: computed(() => error.value),
    requestAllowance,

    setAllowanceTransactionHash,
    setAllowanceReceipt,
    setAllowanceStatus,
    setAllowanceInProgress,
    setAllowanceError,
    setAllowance,
    resetSetAllowance,
  };
};
