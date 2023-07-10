<template>
  <CommonModal v-model:opened="walletWarningModal" :close-on-background-click="false" title="Wallet warning">
    <p class="leading-normal">
      zkSync Portal is still in beta. For the best experience, we recommend using
      <span class="font-medium">MetaMask</span>. Some features may not work properly with other wallets.
    </p>

    <div class="mt-3 flex items-start">
      <CommonCheckbox v-model="doNotShowWarning">Do not show again</CommonCheckbox>
    </div>

    <CommonButton class="mx-auto mt-4" variant="primary-solid" @click="walletWarningModal = false">
      Proceed
    </CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import { useStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

const { connectorName } = storeToRefs(useOnboardStore());

const doNotShowWarning = useStorage("wallet-warning-hidden", false);
const walletWarningModal = ref(false);
watch(
  connectorName,
  (name) => {
    if (doNotShowWarning.value) return;
    if (name && name !== "MetaMask") {
      walletWarningModal.value = true;
    }
  },
  { immediate: true }
);
</script>
