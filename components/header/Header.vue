<template>
  <header class="header">
    <div class="logo-container">
      <NuxtLink v-if="logoLeadsHome" :to="{ name: 'index' }">
        <IconsZkSync class="logo-icon" />
      </NuxtLink>
      <a v-else href="https://zksync.io" target="_blank">
        <IconsZkSync class="logo-icon" />
      </a>
    </div>
    <div class="links-container">
      <NuxtLink class="link-item" :to="{ name: 'bridge' }">
        <ArrowsUpDownIcon class="link-icon" aria-hidden="true" />
        Bridge
      </NuxtLink>
      <NuxtLink class="link-item" :to="{ name: 'index' }">
        <WalletIcon class="link-icon" aria-hidden="true" />
        Assets
      </NuxtLink>
      <NuxtLink class="link-item" :to="{ name: 'transactions' }">
        <ArrowsRightLeftIcon class="link-icon" aria-hidden="true" />
        Transactions
      </NuxtLink>
    </div>
    <div class="right-side">
      <HeaderNetworkDropdown class="network-dropdown" />
      <CommonButton v-if="!account.address" variant="primary" @click="onboardStore.openModal()">
        Connect wallet
      </CommonButton>
      <HeaderAccountDropdown v-else />
      <CommonButton class="color-mode-button" @click="switchColorMode()">
        <SunIcon class="h-6 w-6" aria-hidden="true" />
      </CommonButton>
      <CommonButton class="hamburger-icon">
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </CommonButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ArrowsRightLeftIcon, ArrowsUpDownIcon, Bars3Icon, SunIcon, WalletIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useColorMode from "@/composables/useColorMode";

import { useRoute } from "#app";
import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);

const route = useRoute();
const logoLeadsHome = computed(() => route.name !== "index");

const { switchColorMode } = useColorMode();
</script>

<style lang="scss" scoped>
.header {
  @apply z-50 flex h-[88px] w-full items-center gap-10 p-2 sm:p-4;
  grid-area: header;

  .logo-container {
    @apply w-max;
    .logo-icon {
      @apply h-auto w-full max-w-[160px];
    }
  }
  .links-container {
    @apply hidden items-center gap-10 lg:flex;

    .link-item {
      @apply flex items-center gap-1 text-lg text-neutral-600 dark:text-neutral-500;
      &.router-link-exact-active {
        @apply text-neutral-950 dark:text-white;
      }

      .link-icon {
        @apply h-6 w-6;
      }
    }
  }
  .right-side {
    @apply ml-auto flex items-center gap-3;

    .network-dropdown,
    .color-mode-button {
      @apply hidden xl:block;
    }
    .hamburger-icon {
      @apply xl:hidden;
    }
  }
}
</style>
