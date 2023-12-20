<template>
  <header class="header">
    <HeaderMobileMainNavigation v-model:opened="mobileMainNavigationOpened" />
    <HeaderMobileAccountNavigation v-model:opened="mobileAccountNavigationOpened" />

    <div class="logo-container">
      <NuxtLink :to="{ name: 'index' }">
        <IconsZkSync class="logo-icon" />
      </NuxtLink>
    </div>
    <div class="links-container">
      <NuxtLink
        class="link-item"
        :to="{ name: 'bridge' }"
        :class="{ 'router-link-exact-active': route.name === 'bridge-withdraw' }"
      >
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
      <CommonButton v-if="!isConnected" variant="primary" @click="onboardStore.openModal()">
        <span class="whitespace-nowrap">Connect wallet</span>
      </CommonButton>
      <template v-else>
        <div class="sm:hidden">
          <HeaderAccountDropdownButton no-chevron @click="mobileAccountNavigationOpened = true" />
        </div>
        <div class="hidden sm:block">
          <HeaderAccountDropdown />
        </div>
      </template>
      <CommonButton class="color-mode-button" @click="switchColorMode()">
        <SunIcon class="h-6 w-6" aria-hidden="true" />
      </CommonButton>
      <CommonButton class="hamburger-icon" @click="mobileMainNavigationOpened = true">
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </CommonButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { ArrowsRightLeftIcon, ArrowsUpDownIcon, Bars3Icon, SunIcon, WalletIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useColorMode from "@/composables/useColorMode";

import { useRoute } from "#imports";
import { useOnboardStore } from "@/store/onboard";

const route = useRoute();

const onboardStore = useOnboardStore();
const { isConnected } = storeToRefs(onboardStore);

const mobileMainNavigationOpened = ref(false);
const mobileAccountNavigationOpened = ref(false);

const { switchColorMode } = useColorMode();
</script>

<style lang="scss" scoped>
.header {
  @apply z-50 flex w-full items-center gap-2 p-2 sm:gap-10 sm:p-4;

  .logo-container {
    @apply w-full flex-shrink sm:w-max;
    .logo-icon {
      @apply h-auto w-full max-w-[140px] sm:max-w-[160px];
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
    @apply ml-auto flex items-center gap-1 sm:gap-3;

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
