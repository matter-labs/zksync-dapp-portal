<template>
  <CommonModal v-model:opened="walletWarningModal" :close-on-background-click="false" title="Wallet warning">
    <p class="leading-normal">
      Make sure your wallet supports zkSync Era network before adding funds to your account. Otherwise, this can result
      in <span class="font-medium text-red-600">loss of funds</span>. See the list of supported wallets on the
      <a class="link" href="https://ecosystem.zksync.io/?filter=WALLET" target="_blank">Ecosystem</a> website.
    </p>

    <CommonCheckbox v-model="warningChecked" class="mt-3">I understand the risk</CommonCheckbox>

    <div class="mt-4">
      <CommonHeightTransition :opened="warningChecked">
        <CommonButtonTopLink @click="doNotShowAgain">Do not show again</CommonButtonTopLink>
      </CommonHeightTransition>
      <CommonButton
        class="mx-auto"
        variant="primary-solid"
        :disabled="!warningChecked"
        @click="walletWarningModal = false"
      >
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

const { connectorName } = storeToRefs(useOnboardStore());
const { version } = storeToRefs(useNetworkStore());

const doNotShowWarning = useStorage("wallet-warning-hidden", false);
const warningChecked = ref(false);
const walletWarningModal = ref(true);
watch(
  [connectorName, version],
  ([name, zkSyncVersion]) => {
    if (doNotShowWarning.value) return;
    if (zkSyncVersion === "era" && name && name !== "MetaMask") {
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
