import { useMemoize } from "@vueuse/core";
import { BigNumber, type BigNumberish } from "ethers";
import { Wallet } from "zksync-web3";

import ZkSyncL1BridgeInterface from "zksync-web3/abi/IL1Bridge.json";
import ZkSyncContractInterface from "zksync-web3/abi/IZkSync.json";

import type { TransactionInfo } from "@/store/zksync/transactionStatus";
import type { Hash } from "@/types";

import { useOnboardStore } from "@/store/onboard";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import { useZkSyncTokensStore } from "@/store/zksync/tokens";
import { useZkSyncWalletStore } from "@/store/zksync/wallet";
import { formatError } from "@/utils/formatters";

export default (transactionInfo: ComputedRef<TransactionInfo>) => {
  const status = ref<"not-started" | "processing" | "waiting-for-signature" | "sending" | "done">("not-started");
  const error = ref<Error | undefined>();
  const transactionHash = ref<Hash | undefined>();
  const onboardStore = useOnboardStore();
  const eraWalletStore = useZkSyncWalletStore();
  const providerStore = useZkSyncProviderStore();
  const tokensStore = useZkSyncTokensStore();
  const { isCorrectNetworkSet } = storeToRefs(onboardStore);
  const { tokens } = storeToRefs(tokensStore);
  const { balance } = storeToRefs(eraWalletStore);

  const retrieveBridgeAddress = useMemoize(() =>
    providerStore
      .requestProvider()
      .getDefaultBridgeAddresses()
      .then((e) => e.erc20L1)
  );
  const retrieveMainContractAddress = useMemoize(() => providerStore.requestProvider().getMainContractAddress());

  const gasLimit = ref<BigNumberish | undefined>();
  const gasPrice = ref<BigNumberish | undefined>();
  const finalizeWithdrawalParams = ref<
    | {
        l1BatchNumber: unknown;
        l2MessageIndex: unknown;
        l2TxNumberInBlock: unknown;
        message: unknown;
        proof: unknown;
      }
    | undefined
  >();

  const totalFee = computed(() => {
    if (!gasLimit.value || !gasPrice.value) return undefined;
    return calculateFee(gasLimit.value, gasPrice.value).toString();
  });
  const feeToken = computed(() => {
    return tokens.value?.[ETH_TOKEN.address];
  });
  const usingMainContract = computed(() => transactionInfo.value.token.address === ETH_TOKEN.address);

  const getFinalizationParams = async () => {
    const provider = providerStore.requestProvider();
    const wallet = new Wallet(
      // random private key cause we don't care about actual signer
      // finalizeWithdrawalParams only exists on Wallet class
      "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
      provider
    );
    const { l1BatchNumber, l2MessageIndex, l2TxNumberInBlock, message, proof } = await wallet.finalizeWithdrawalParams(
      transactionInfo.value.transactionHash
    );
    return {
      l1BatchNumber,
      l2MessageIndex,
      l2TxNumberInBlock,
      message,
      proof,
    };
  };

  const getTransactionParams = async () => {
    finalizeWithdrawalParams.value = await getFinalizationParams();
    if (usingMainContract.value) {
      return {
        address: (await retrieveMainContractAddress()) as Hash,
        abi: ZkSyncContractInterface.abi,
        account: onboardStore.account.address!,
        functionName: "finalizeEthWithdrawal",
        args: Object.values(finalizeWithdrawalParams.value!),
      };
    } else {
      return {
        address: (await retrieveBridgeAddress()) as Hash,
        abi: ZkSyncL1BridgeInterface.abi,
        account: onboardStore.account.address!,
        functionName: "finalizeWithdrawal",
        args: Object.values(finalizeWithdrawalParams.value!),
      };
    }
  };

  const {
    inProgress: estimationInProgress,
    error: estimationError,
    execute: estimateFee,
  } = usePromise(
    async () => {
      tokensStore.requestTokens();
      eraWalletStore.requestBalance();
      const provider = providerStore.requestProvider();

      const transactionParams = await getTransactionParams();
      const [price, limit] = await Promise.all([
        retry(() => provider.getGasPrice()),
        retry(async () => {
          const publicClient = onboardStore.getPublicClient();
          return BigNumber.from(
            (
              await publicClient.estimateContractGas({
                ...transactionParams,
              })
            ).toString()
          );
        }),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gasPrice.value = price;
      gasLimit.value = limit;

      return {
        transactionParams,
        gasPrice: gasPrice.value,
        gasLimit: gasLimit.value,
      };
    },
    { cache: 1000 * 8 }
  );

  const enoughBalanceToCoverFee = computed(() => {
    if (!feeToken.value || estimationInProgress.value) {
      return true;
    }
    const feeTokenBalance = balance.value.find((e) => e.address === feeToken.value!.address);
    if (!feeTokenBalance) return true;
    if (totalFee.value && BigNumber.from(totalFee.value).gt(feeTokenBalance.amount)) {
      return false;
    }
    return true;
  });

  const commitTransaction = async () => {
    try {
      error.value = undefined;

      status.value = "processing";
      if (!isCorrectNetworkSet.value) {
        await onboardStore.setCorrectNetwork();
      }
      const wallet = await onboardStore.getWallet();
      const { transactionParams, gasLimit, gasPrice } = (await estimateFee())!;
      status.value = "waiting-for-signature";
      transactionHash.value = await wallet.writeContract({
        ...transactionParams,
        gasPrice: BigInt(gasPrice.toString()),
        gas: BigInt(gasLimit.toString()),
      });

      status.value = "sending";
      const receipt = await onboardStore.getPublicClient().waitForTransactionReceipt({
        hash: transactionHash.value!,
        onReplaced: (replacement) => {
          transactionHash.value = replacement.transaction.hash;
        },
      });

      status.value = "done";
      return receipt;
    } catch (err) {
      error.value = formatError(err as Error);
      status.value = "not-started";
    }
  };

  return {
    estimationError,
    estimationInProgress,
    totalFee,
    feeToken,
    enoughBalanceToCoverFee,
    estimateFee,

    status,
    error,
    transactionHash,
    commitTransaction,
  };
};
