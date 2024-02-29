<template>
  <div class="transaction-footer">
    <!-- Change network -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'network' && switchingNetworkError"
        class="mb-2"
        @try-again="eraWalletStore.setCorrectNetwork"
      >
        Network change error: {{ switchingNetworkError.message }}
      </CommonErrorBlock>
    </transition>

    <div v-if="buttonStep === 'connect'" class="transaction-footer-row">
      <CommonButton variant="primary" :disabled="isConnectingWallet" class="w-full" @click="onboardStore.openModal">
        Connect wallet
      </CommonButton>
    </div>
    <div v-if="buttonStep === 'network'" class="transaction-footer-row">
      <CommonButtonTopInfo>Incorrect network selected in your wallet</CommonButtonTopInfo>
      <CommonButton
        v-if="connectorName !== 'WalletConnect'"
        type="submit"
        :disabled="switchingNetworkInProgress"
        variant="primary"
        class="w-full"
        @click="eraWalletStore.setCorrectNetwork"
      >
        Change wallet network to {{ eraNetwork.name }}
      </CommonButton>
      <CommonButton v-else disabled variant="primary" class="w-full">
        Change network manually to {{ eraNetwork.name }} in your {{ walletName }} wallet
      </CommonButton>
    </div>
    <div v-else-if="buttonStep === 'continue'" class="transaction-footer-row">
      <slot name="after-checks" />
    </div>

    <TransactionButtonUnderlineContinueInWallet :opened="continueInWalletTipDisplayed" />
  </div>
</template>

<script lang="ts" setup>
const onboardStore = useOnboardStore();
const eraWalletStore = useZkSyncWalletStore();

const { account, isConnectingWallet, connectorName, walletName } = storeToRefs(onboardStore);
const { isCorrectNetworkSet, switchingNetworkInProgress, switchingNetworkError } = storeToRefs(eraWalletStore);
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());

const buttonStep = computed(() => {
  if (!account.value.address || isConnectingWallet.value) {
    return "connect";
  } else if (!isCorrectNetworkSet.value) {
    return "network";
  } else {
    return "continue";
  }
});

const continueInWalletTipDisplayed = computed(() => {
  if (buttonStep.value === "network" && switchingNetworkInProgress.value) {
    return true;
  }
  return false;
});
</script>

<style lang="scss" scoped>
.transaction-footer {
  @apply sticky bottom-0 z-10 flex flex-col items-center bg-neutral-50/60 bg-opacity-60 pb-2 pt-4 backdrop-blur-sm dark:bg-black dark:bg-opacity-60;

  .transaction-footer-row {
    @apply flex w-full flex-col items-center;
  }
}
</style>
