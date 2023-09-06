<template>
  <nav class="navbar-container">
    <ModalNetworkChange v-model:opened="networkChangeModalOpened" />

    <nav class="navbar-inner">
      <SidebarAccountButton />
      <div class="navbar-links-container">
        <NuxtLink :to="{ name: 'index' }" class="navbar-link">
          <WalletIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Assets</span>
        </NuxtLink>
        <NuxtLink
          v-if="version !== 'era' || (version === 'era' && eraNetwork.blockExplorerApi)"
          :to="{ name: 'payments' }"
          class="navbar-link"
        >
          <ArrowsRightLeftIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Transactions</span>
        </NuxtLink>
        <NuxtLink
          v-else-if="version === 'era' && !eraNetwork.blockExplorerApi"
          :to="{ name: 'transaction-zksync-era-send' }"
          class="navbar-link desktop-hidden"
        >
          <PaperAirplaneIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Send</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'contacts' }" class="navbar-link">
          <UserGroupIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Contacts</span>
        </NuxtLink>
      </div>
      <div class="navbar-bottom">
        <button
          v-tooltip="'Change network'"
          class="navbar-link navbar-bottom-button network-switch"
          data-testid="network-switcher"
          @click="networkChangeModalOpened = true"
        >
          <IconsEra v-if="version === 'era'" class="navbar-link-icon" />
          <IconsZkSyncLite v-else-if="version === 'lite'" class="navbar-link-icon" />
          <span class="navbar-link-label">{{ selectedNetwork.shortName }}</span>
          <ChevronDownIcon class="dropdown-icon" aria-hidden="true" />
        </button>
      </div>
    </nav>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import {
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  WalletIcon,
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";
import { useEraProviderStore } from "@/store/zksync/era/provider";

const { selectedNetwork, version } = storeToRefs(useNetworkStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());

const networkChangeModalOpened = ref(false);
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply sticky bottom-0 top-auto z-[3];
  grid-area: menu / menu / menu / menu;

  @media screen and (min-width: 720px) {
    @apply bottom-auto top-0 max-h-[calc(100vh_-_72px)] px-4 py-8 lg:max-h-[calc(100vh_-_72px_-_12px)];
  }
  @media screen and (min-width: 1024px) {
    @apply px-6;
  }

  .navbar-inner {
    @apply grid h-full min-w-[3.5rem] grid-cols-[max-content_1fr] grid-rows-[repeat(2,_max-content)_1fr] bg-white dark:bg-neutral-900 md:max-w-[3.5rem] md:grid-cols-1 md:bg-transparent dark:md:bg-transparent xl:max-w-[12.5rem];

    .navbar-links-container {
      @apply flex justify-around space-y-1 pr-3 md:mt-6 md:flex-col md:pr-0;
    }
    .navbar-link {
      @apply flex items-center rounded-2xl bg-transparent text-gray-secondary no-underline transition-colors md:w-full md:px-4 md:py-3 md:hover:bg-gray-200/60 dark:md:hover:bg-neutral-800;
      @apply dark:text-white;
      &.router-link-exact-active {
        @apply bg-white text-primary-400 dark:bg-neutral-900 dark:text-white;
      }
      &.desktop-hidden {
        @apply md:hidden;
      }

      .navbar-link-icon {
        @apply h-6 w-6 text-inherit;
      }
      .navbar-link-label {
        @apply ml-4 mr-auto hidden text-left font-medium leading-4 tracking-[-0.1px] xl:block;
      }
    }
    .navbar-bottom {
      @apply fixed bottom-8 mt-auto hidden space-y-2 md:block xl:w-[200px];

      .navbar-bottom-button {
        @apply border bg-gray-100 hover:border-gray-300 dark:border-neutral-900 dark:bg-neutral-900;

        .navbar-link-label {
          @apply text-sm leading-tight;
        }
      }
      .network-switch {
        @apply text-neutral-800 dark:text-white;
        .navbar-link-icon {
          @apply text-black dark:text-white;
        }
        .dropdown-icon {
          @apply hidden h-4 w-4 text-inherit xl:block;
        }
      }
    }
  }
}
</style>
