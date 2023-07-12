<template>
  <LoadersConnecting />
  <ModalNetworkChangedWarning v-if="!isConnectingWallet" />
  <div class="bridge-layout" v-else>
    <ModalWalletWarning />

    <Header />
    <main class="bridge-layout-main">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

const { isConnectingWallet } = storeToRefs(useOnboardStore());
</script>

<style lang="scss" scoped>
.bridge-layout {
  @apply relative flex flex-col;
  min-height: 100vh;
  min-height: 100dvh;

  .bridge-layout-main {
    @apply mx-auto my-auto flex w-11/12 max-w-[560px] flex-col px-4 py-2 md:px-0 md:py-4;
  }
}
</style>
