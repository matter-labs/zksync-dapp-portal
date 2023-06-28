<template>
  <CommonModal v-model:opened="walletWarningModal" :close-on-background-click="false" title="Wallet warning">
    <p class="leading-normal">
      zkSync Portal is still in beta. For the best experience, we recommend using
      <span class="font-medium">MetaMask</span>. Some features may not work properly with other wallets.
    </p>

    <div class="mt-3 flex items-start">
      <label for="risc" class="flex cursor-pointer items-center">
        <div class="relative">
          <input type="checkbox" id="risc" v-model="doNotShowWarning" class="sr-only" tabindex="-1" />
          <div
            class="flex h-6 w-6 items-center justify-center rounded-md border-2 border-gray-300 bg-white outline-none ring-primary-400 ring-offset-2 focus:ring-2"
            v-bind:class="{ 'bg-primary-600 border-primary-600': doNotShowWarning }"
            tabindex="0"
            @keyup.enter="doNotShowWarning = !doNotShowWarning"
          >
            <svg v-show="doNotShowWarning" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div id="risc-description" class="ml-3 text-sm font-medium leading-6">Do not show again</div>
      </label>
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

const { walletName } = storeToRefs(useOnboardStore());

const doNotShowWarning = useStorage("wallet-warning-hidden", false);
const walletWarningModal = ref(false);
watch(
  walletName,
  (name) => {
    if (doNotShowWarning.value) return;
    if (name && name !== "MetaMask") {
      walletWarningModal.value = true;
    }
  },
  { immediate: true }
);
</script>
