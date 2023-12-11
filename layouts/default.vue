<template>
  <LoadersConnecting />
  <ModalNetworkChangedWarning v-if="!isConnectingWallet" />
  <ModalConnectingWalletError />

  <LoginLayout v-if="!account.isConnected">
    <LoginPage />
  </LoginLayout>
  <div class="app-layout" v-else>
    <ModalWalletWarning />

    <Header />
    <main class="app-layout-main">
      <NuxtPage />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import LoginLayout from "@/layouts/login.vue";
import { useOnboardStore } from "@/store/onboard";
import LoginPage from "@/views/Login.vue";

const { account, isConnectingWallet } = storeToRefs(useOnboardStore());
</script>

<style lang="scss" scoped>
.app-layout {
  @apply grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-areas: "header" "main";
  grid-template-rows: auto 1fr;

  .app-layout-main {
    @apply flex min-h-0 w-full min-w-0 max-w-[700px] flex-col justify-self-center p-2 md:px-0 md:py-4;
    grid-area: main;
  }
}
</style>
