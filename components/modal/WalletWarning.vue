<template>
  <CommonModal :initialFocus="checkbox" v-model:opened="walletWarningModal" :closable="false" title="Wallet warning">
    <p class="leading-normal">
      Make sure your wallet supports {{ selectedNetwork.name }} network before adding funds to your account. Otherwise,
      this can result in <span class="font-medium text-red-600">loss of funds</span>. See the list of supported wallets
      on the
      <a
        class="underline underline-offset-2"
        href="https://zksync.dappradar.com/ecosystem?category-de=wallet"
        target="_blank"
        >Ecosystem</a
      >
      website.
    </p>

    <CommonCheckbox ref="checkbox" v-model="warningChecked" class="mt-3">I understand the risk</CommonCheckbox>

    <div class="mt-4">
      <CommonHeightTransition :opened="warningChecked">
        <CommonButtonTopLink @click="doNotShowAgain">Do not show again</CommonButtonTopLink>
      </CommonHeightTransition>
      <CommonButton class="w-full" variant="primary" :disabled="!warningChecked" @click="walletWarningModal = false">
        Proceed
      </CommonButton>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import { useStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";

const { selectedNetwork } = storeToRefs(useNetworkStore());
const { walletNotSupported } = storeToRefs(useOnboardStore());
const checkbox = ref<HTMLInputElement | undefined>();

const doNotShowWarning = useStorage("wallet-warning-hidden", false);
const warningChecked = ref(false);
const walletWarningModal = ref(false);
watch(
  walletNotSupported,
  (notSupported) => {
    if (doNotShowWarning.value) return;
    if (!notSupported) {
      walletWarningModal.value = false;
    } else {
      walletWarningModal.value = true;
    }
  },
  { immediate: true }
);

const doNotShowAgain = () => {
  doNotShowWarning.value = true;
  walletWarningModal.value = false;
};
</script>
