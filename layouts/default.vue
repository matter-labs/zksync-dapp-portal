<template>
  <Head>
    <Title>{{ meta.title }}</Title>
    <Meta name="og:title" :content="meta.title" />
    <Meta name="og:site_name" :content="meta.title" />
    <Meta name="description" :content="meta.description" />
    <Meta name="og:description" :content="meta.description" />

    <Meta property="og:image:type" content="image/jpeg" />
    <Meta property="og:image:width" content="1200" />
    <Meta property="og:image:height" content="630" />
    <Meta property="og:image:alt" content="zkSync Portal" />
    <Meta property="og:image" content="https://portal.zksync.io/preview.jpg" />
  </Head>

  <LoadersConnecting />
  <ModalNetworkChangedWarning v-if="!isConnectingWallet" />
  <LoginLayout v-if="!account.isConnected">
    <LoginPage />
  </LoginLayout>
  <div class="app-layout" v-else>
    <ModalWalletWarning />

    <Header />
    <Sidebar />
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

const meta = {
  title: "zkSync Portal | Wallet, Bridge and Faucet",
  description:
    "zkSync Portal provides all the required tools for working with Era and Lite networks such as Wallet, Bridge & Faucet functionality.",
};

const { account, isConnectingWallet } = storeToRefs(useOnboardStore());
</script>

<style lang="scss" scoped>
.app-layout {
  @apply mx-auto grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-areas:
    "header"
    "main"
    "main-actions"
    "menu"
    "side"
    "toast";
  grid-template-rows: auto 1fr auto auto 0px 0px;

  @media screen and (min-width: 720px) {
    --rui-layout-nav-gap: 1fr;
    --rui-layout-side-gap: var(--rui-layout-nav-gap);
    --rui-layout-nav-size: 5.5rem;
    --rui-layout-main-size: 31.25rem;
    --rui-layout-side-size: minmax(var(--rui-layout-nav-size), auto);
    grid-template-areas:
      "header header header header header"
      "menu . main . ."
      "menu . main-actions . ."
      "side side side side side"
      "toast toast toast toast toast";
    grid-template-columns:
      var(--rui-layout-nav-size) var(--rui-layout-nav-gap) var(--rui-layout-main-size) var(--rui-layout-side-gap)
      var(--rui-layout-side-size);
  }
  @media screen and (min-width: 1024px) {
    --rui-layout-nav-size: 6.5rem;
    grid-template-areas:
      "header header header header header"
      "menu . main . side"
      "menu . main-actions . side"
      ". . toast . .";
    grid-template-rows: auto 1fr auto auto;
  }
  @media screen and (min-width: 1280px) {
    --rui-layout-nav-size: 15.5rem;
    --rui-layout-main-size: 33.5rem;
  }
  @media screen and (min-width: 1920px) {
    --rui-layout-start: 9.5rem;
    --rui-layout-side-size: calc(var(--rui-layout-start) + var(--rui-layout-nav-size));
    max-width: 94.375rem;
    grid-template-areas:
      ". header header header header header ."
      ". menu . main . side ."
      ". menu . main-actions . side ."
      ". . . toast . . .";
    grid-template-columns:
      var(--rui-layout-start) var(--rui-layout-nav-size) var(--rui-layout-nav-gap) var(--rui-layout-main-size)
      var(--rui-layout-side-gap) var(--rui-layout-side-size) var(--rui-layout-end, 0);
  }

  .app-layout-main {
    @apply flex min-h-0 min-w-0 flex-col px-4 py-2 md:px-0 md:py-4;
    grid-area: main / main / main / main;
  }
}
</style>
