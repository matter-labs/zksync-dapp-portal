<template>
  <ModalNetworkChangedWarning v-if="!isConnectingWallet" />
  <ModalWalletWarning />

  <div class="bridge-layout">
    <Header />
    <main class="bridge-layout-main">
      <template v-if="step === 'select-address'">
        <CommonBackButton @click="step = 'bridge'" class="-mt-6" />
        <SelectAddress title="Bridge to" />
      </template>

      <template v-else>
        <BridgeNavigation />
        <NuxtPage :address="toAddress" @select-address="step = 'select-address'" />
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";
import SelectAddress from "@/views/SelectAddress.vue";

const { account, isConnectingWallet } = storeToRefs(useOnboardStore());

const step = ref<"bridge" | "select-address">("bridge");
const address = ref("");
const toAddress = computed(() => {
  if (!address.value) return account.value.address;
  return address.value;
});
</script>

<style lang="scss" scoped>
.bridge-layout {
  @apply relative grid grid-cols-1 grid-rows-[max-content_1fr];
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-areas:
    "header header header header"
    "menu menu menu menu";

  .bridge-layout-main {
    @apply mx-auto my-auto flex h-full w-11/12 max-w-[500px] flex-col py-4;
    @media screen and (min-width: 640px) and (min-height: 720px) {
      @apply max-h-[525px];
    }
  }
}
</style>
