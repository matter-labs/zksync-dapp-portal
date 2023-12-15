<template>
  <CommonModal v-model:opened="modalShown" title="Connecting error" @after-leave="clearError">
    <p class="leading-normal">{{ connectingWalletError }}</p>
    <CommonButton class="mt-4 w-full" variant="primary" @click="modalShown = false">Proceed</CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

const { connectingWalletError } = storeToRefs(useOnboardStore());

const modalShown = ref(!!connectingWalletError.value);
watch(connectingWalletError, (value) => {
  modalShown.value = !!value;
});

const clearError = () => {
  connectingWalletError.value = undefined;
};
</script>
