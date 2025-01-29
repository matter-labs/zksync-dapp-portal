import { L1Signer, utils } from "zksync-ethers";
import IERC20 from "zksync-ethers/abi/IERC20.json";

import type { Hash, TokenAllowance } from "@/types";
import type { BigNumberish } from "ethers";

export default (
  accountAddress: Ref<string | undefined>,
  tokenAddress: Ref<string | undefined>,
  getContractAddress: () => Promise<string | undefined>,
  getL1Signer: () => Promise<L1Signer | undefined>
) => {
  const { getPublicClient } = useOnboardStore();
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
      return BigInt(allowance);
    },
    { cache: false }
  );

  const requestAllowance = async () => {
    if (accountAddress.value && tokenAddress.value && tokenAddress.value !== utils.ETH_ADDRESS) {
      await getAllowance();
    } else {
      reset();
    }
  };

  let approvalAmounts: TokenAllowance[] = [];
  const setAllowanceStatus = ref<"not-started" | "processing" | "waiting-for-signature" | "sending" | "done">(
    "not-started"
  );
  const setAllowanceTransactionHashes = ref<(Hash | undefined)[]>([]);

  const {
    result: setAllowanceReceipts,
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

        const wallet = await getL1Signer();
        setAllowanceStatus.value = "waiting-for-signature";

        const receipts = [];

        for (let i = 0; i < approvalAmounts.length; i++) {
          const txResponse = await wallet?.approveERC20(approvalAmounts[i].token, approvalAmounts[i].allowance);

          setAllowanceTransactionHashes.value.push(txResponse?.hash as Hash);

          setAllowanceStatus.value = "sending";

          const receipt = await retry(
            () =>
              getPublicClient().waitForTransactionReceipt({
                hash: setAllowanceTransactionHashes.value[i]!,
                onReplaced: (replacement) => {
                  setAllowanceTransactionHashes.value[i] = replacement.transaction.hash;
                },
              }),
            {
              retries: 3,
              delay: 5_000,
            }
          );

          receipts.push(receipt);
        }

        await requestAllowance();

        setAllowanceStatus.value = "done";
        return receipts;
      } catch (err) {
        setAllowanceStatus.value = "not-started";
        throw err;
      }
    },
    { cache: false }
  );
  const getApprovalAmounts = async (amount: BigNumberish) => {
    const wallet = await getL1Signer();
    if (!wallet) throw new Error("Wallet is not available");
    const depositAllowanceParams = await wallet.getDepositAllowanceParams(tokenAddress.value!, amount);

    // Map returned approval amounts to increase amount by 1% to account for gas changes
    approvalAmounts = depositAllowanceParams.map((allowanceParams) => {
      // The allowance will return the same value as the amount in cases it doesn't need to include gas
      const shouldIncrease = BigInt(allowanceParams.allowance) !== BigInt(amount);
      // Increase allowance by 1% in case the gas changes, if the allowance needs to include gas
      const increasedAllowance = (BigInt(allowanceParams.allowance) * 1n) / 100n + BigInt(allowanceParams.allowance);

      return {
        allowance: shouldIncrease ? increasedAllowance : BigInt(allowanceParams.allowance),
        token: allowanceParams.token,
      };
    });

    return approvalAmounts;
  };

  const setAllowance = async (amount: BigNumberish) => {
    await getApprovalAmounts(amount);
    await executeSetAllowance();
  };

  const resetSetAllowance = () => {
    approvalAmounts = [];
    setAllowanceStatus.value = "not-started";
    setAllowanceTransactionHashes.value = [];
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

    setAllowanceTransactionHashes,
    setAllowanceReceipts,
    setAllowanceStatus,
    setAllowanceInProgress,
    setAllowanceError,
    setAllowance,
    resetSetAllowance,
    getApprovalAmounts,
  };
};
