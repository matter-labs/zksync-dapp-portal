<template>
  <div class="transaction-footer">
    <ModalZksyncLiteWalletAuthorization v-model:opened="modalWalletAuthorizationOpened" />
    <ModalZksyncLiteAccountActivation v-model:opened="modalAccountActivationOpened" />

    <!-- Change network -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'network' && switchingNetworkError"
        class="mb-2"
        @try-again="onboardStore.setCorrectNetwork"
      >
        Network change error: {{ switchingNetworkError.message }}
      </CommonErrorBlock>
    </transition>

    <!-- Authorize -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'authorize' && authorizationError"
        class="mb-2"
        @try-again="authorizeWallet"
      >
        Authorization error: {{ authorizationError.message }}
      </CommonErrorBlock>
    </transition>

    <!-- Activate -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'activate' && accountActivationSigningError"
        class="mb-2"
        @try-again="signAccountActivation"
      >
        Signing account activation error: {{ accountActivationSigningError.message }}
      </CommonErrorBlock>
    </transition>
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonAlert
        v-if="buttonStep === 'activate' && !canSignAccountActivation"
        variant="error"
        :icon="ExclamationTriangleIcon"
        class="mb-2"
      >
        <p>
          To activate your account, you need a history of committed balance. Visit
          <NuxtLink class="font-medium underline underline-offset-2" :to="{ name: 'transaction-zksync-lite-receive' }"
            >Add funds</NuxtLink
          >
          page to add balance, and wait for deposited funds to become available on
          <span class="font-medium">{{ destinations.zkSyncLite.label }}</span
          >.
        </p>
      </CommonAlert>
    </transition>

    <div v-if="buttonStep === 'network'" class="transaction-footer-row">
      <CommonButtonTopInfo>Incorrect network selected in your wallet</CommonButtonTopInfo>
      <template v-if="zkSyncLiteNetwork.l1Network">
        <CommonButton
          v-if="connectorName !== 'WalletConnect'"
          type="submit"
          :disabled="switchingNetworkInProgress"
          variant="primary-solid"
          @click="onboardStore.setCorrectNetwork"
        >
          Change wallet network to {{ zkSyncLiteNetwork.l1Network.name }}
        </CommonButton>
        <CommonButton v-else disabled variant="primary-solid">
          Change network manually to {{ zkSyncLiteNetwork.l1Network.name }} in your {{ walletName }} wallet
        </CommonButton>
      </template>
      <template v-else>
        <CommonButton disabled variant="primary-solid">
          L1 network is not available on {{ zkSyncLiteNetwork.name }}
        </CommonButton>
      </template>
    </div>
    <div v-else-if="buttonStep === 'authorize'" class="transaction-footer-row">
      <CommonButtonTopLink @click="modalWalletAuthorizationOpened = true">What is authorization?</CommonButtonTopLink>
      <CommonButton
        :disabled="authorizationInProgress || accountActivationCheckInProgress"
        type="submit"
        variant="primary-solid"
        @click="authorizeWallet"
      >
        Authorize to continue
      </CommonButton>
    </div>
    <div v-else-if="buttonStep === 'activate'" class="transaction-footer-row">
      <CommonButtonTopLink @click="modalAccountActivationOpened = true">
        What is account activation?
      </CommonButtonTopLink>
      <CommonButton
        :disabled="!canSignAccountActivation || accountActivationSigningInProgress"
        type="submit"
        variant="primary-solid"
        @click="signAccountActivation"
      >
        Sign account activation
      </CommonButton>
    </div>
    <div v-else-if="buttonStep === 'continue'" class="transaction-footer-row">
      <slot name="after-checks" />
    </div>

    <TransactionButtonUnderlineContinueInWallet :opened="continueInWalletTipDisplayed" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { TransitionAlertScaleInOutTransition } from "@/utils/transitions";

const props = defineProps({
  authorization: {
    type: Boolean,
    default: true,
  },
  accountActivation: {
    type: Boolean,
    default: true,
  },
});

const onboardStore = useOnboardStore();
const walletLiteStore = useLiteWalletStore();
const liteAccountActivationStore = useLiteAccountActivationStore();

const { isCorrectNetworkSet, switchingNetworkInProgress, switchingNetworkError, connectorName, walletName } =
  storeToRefs(onboardStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { zkSyncLiteNetwork } = storeToRefs(useLiteProviderStore());
const { isAuthorized, authorizationInProgress, authorizationError } = storeToRefs(walletLiteStore);
const {
  isAccountActivated,
  accountActivationCheckInProgress,
  isAccountActivationSigned,
  canSignAccountActivation,
  accountActivationSigningInProgress,
  accountActivationSigningError,
} = storeToRefs(liteAccountActivationStore);

const modalWalletAuthorizationOpened = ref(false);
const modalAccountActivationOpened = ref(false);

const buttonStep = computed(() => {
  if (!isCorrectNetworkSet.value && !isAuthorized.value) {
    return "network";
  } else if (
    props.authorization &&
    (!isAuthorized.value || authorizationInProgress.value || accountActivationCheckInProgress.value)
  ) {
    return "authorize";
  } else if (props.accountActivation && isAccountActivated.value === false && !isAccountActivationSigned.value) {
    return "activate";
  } else {
    return "continue";
  }
});

const continueInWalletTipDisplayed = computed(() => {
  if (
    (buttonStep.value === "network" && switchingNetworkInProgress.value) ||
    (buttonStep.value === "authorize" && authorizationInProgress.value) ||
    (buttonStep.value === "activate" && accountActivationSigningInProgress.value)
  ) {
    return true;
  }
  return false;
});

const authorizeWallet = () => {
  walletLiteStore.authorizeWallet().catch(() => undefined);
};
const signAccountActivation = () => {
  liteAccountActivationStore.accountActivationSign().catch(() => undefined);
};
</script>

<style lang="scss" scoped>
.transaction-footer {
  @apply sticky bottom-0 z-10 mt-auto flex flex-col items-center bg-gray bg-opacity-60 pb-2 pt-4 backdrop-blur-sm dark:bg-neutral-950;

  .transaction-footer-row {
    @apply flex w-full flex-col items-center;
  }
}
</style>
