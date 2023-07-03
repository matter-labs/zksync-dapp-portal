import { useStorage } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { getChangePubkeyLegacyMessage, MAX_TIMESTAMP } from "zksync/build/utils";

import type { PubKeyHash } from "zksync/build/types";

import { useOnboardStore } from "@/store/onboard";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";

type AccountActivationTx = {
  accountId: number;
  account: string;
  newPkHash: PubKeyHash;
  nonce: number;
  ethSignature?: string;
  validFrom: number;
  validUntil: number;
  ethAuthData?: {
    type: "Onchain";
  };
};

export const useLiteAccountActivationStore = defineStore("liteAccountActivation", () => {
  const onboardStore = useOnboardStore();
  const liteWalletStore = useLiteWalletStore();
  const { account } = storeToRefs(onboardStore);
  const { isAuthorized, isRemoteWallet, accountState } = storeToRefs(liteWalletStore);
  const storageAccountActivations = useStorage<{ [userAddress: string]: AccountActivationTx }>(
    "account-activations",
    {}
  );

  const {
    result: isAccountActivated,
    inProgress: accountActivationCheckInProgress,
    execute: checkAccountActivation,
    reset: resetAccountActivation,
    reload: reloadAccountActivation,
  } = usePromise<boolean>(async () => {
    const wallet = await liteWalletStore.getWalletInstance();
    if (!wallet) throw new Error("Wallet is not available");

    if (isRemoteWallet.value) {
      return true;
    }

    const accountState = await liteWalletStore.requestAccountState();
    if (!accountState) throw new Error("Account state is not available");

    if (isAuthorized.value) {
      const newPubKeyHash = await liteWalletStore.getSignerPubKeyHash();
      console.log("newPubKeyHash", newPubKeyHash);
      console.log("current PubKey", accountState.committed.pubKeyHash);
      console.log(
        "return",
        accountState.committed.pubKeyHash === newPubKeyHash,
        `accountState.committed.pubKeyHash === newPubKeyHash`
      );
      return true;
    } else {
      console.log(
        "return",
        accountState.committed.pubKeyHash !== "sync:0000000000000000000000000000000000000000",
        `accountState.committed.pubKeyHash !== "sync:0000000000000000000000000000000000000000"`
      );
      return true;
    }
  });
  watch(isAuthorized, (authorized) => {
    if (authorized) {
      checkAccountActivation({ force: true });
    }
  });

  const isAccountActivationSigned = computed(() => {
    if (!account.value.address) return false;
    const signedActivation = storageAccountActivations.value[account.value.address];
    if (signedActivation && !accountState.value) {
      return true;
    } else if (signedActivation && accountState.value) {
      if (
        signedActivation.accountId === accountState.value.id &&
        signedActivation.nonce === accountState.value.committed.nonce
      ) {
        return true;
      }
    }
    return false;
  });
  const canSignAccountActivation = computed(() => {
    if (typeof accountState.value?.id === "number") {
      return true;
    }
    return false;
  });
  const {
    inProgress: accountActivationSigningInProgress,
    error: accountActivationSigningError,
    execute: accountActivationSign,
    reset: resetAccountActivationSign,
  } = usePromise<void>(async () => {
    const accountState = await liteWalletStore.requestAccountState({ force: true });
    if (!accountState) throw new Error("Account state is not available");
    if (!canSignAccountActivation.value) {
      throw new TypeError(
        "It is required to have a history of committed balances on the account to activate it. If you have deposited funds wait a while until they become available"
      );
    }

    const wallet = await liteWalletStore.getWalletInstance();
    if (!wallet) throw new Error("Wallet is not available");

    if (!isRemoteWallet.value && wallet.ethSignerType?.verificationMethod === "ERC-1271") {
      const isOnchainAuthSigningKeySet = await wallet.isOnchainAuthSigningKeySet();
      if (!isOnchainAuthSigningKeySet) {
        const onchainAuthTransaction = await wallet.onchainAuthSigningKey();
        await onchainAuthTransaction?.wait();
      }
    }

    const newPubKeyHash = await liteWalletStore.getSignerPubKeyHash();
    const changePubKeyMessage = getChangePubkeyLegacyMessage(
      newPubKeyHash,
      accountState.committed.nonce,
      accountState.id!
    );
    const ethSignature = (await wallet.ethMessageSigner().getEthMessageSignature(changePubKeyMessage)).signature;
    storageAccountActivations.value[account.value.address!] = {
      accountId: accountState.id!,
      account: wallet.address(),
      newPkHash: newPubKeyHash,
      nonce: accountState.committed.nonce,
      ethSignature,
      validFrom: 0,
      validUntil: MAX_TIMESTAMP,
    };
  });

  const getAccountActivationTransaction = async (feeTokenId: number) => {
    if (!isAccountActivationSigned.value) throw new Error("Account activation is not signed");

    const wallet = await liteWalletStore.getWalletInstance(true);
    if (!wallet) throw new Error("Wallet is not available");

    const signedActivation = storageAccountActivations.value[account.value.address!];
    return await wallet.signer!.signSyncChangePubKey({
      ...signedActivation,
      fee: "0",
      feeTokenId,
    });
  };

  onboardStore.subscribeOnAccountChange((newAddress) => {
    resetAccountActivationSign();
    if (newAddress) {
      reloadAccountActivation();
    } else {
      resetAccountActivation();
    }
  });

  return {
    isAccountActivated,
    accountActivationCheckInProgress,
    checkAccountActivation,

    isAccountActivationSigned,
    canSignAccountActivation,
    accountActivationSigningError: computed(() => accountActivationSigningError.value),
    accountActivationSigningInProgress,
    accountActivationSign,

    getAccountActivationTransaction,
  };
});
