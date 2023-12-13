<template>
  <Menu as="div" class="network-dropdown-container" v-slot="{ open }">
    <MenuButton as="template">
      <CommonButton class="network-dropdown-item">
        <IconsEra class="network-dropdown-item-img" />
        <span>{{ selectedNetwork.name }}</span>
        <ChevronDownIcon class="network-dropdown-item-icon" :class="{ opened: open }" aria-hidden="true" />
      </CommonButton>
    </MenuButton>

    <transition v-bind="TransitionAlertScaleInOutTransition">
      <MenuItems class="network-options-container">
        <MenuItem
          v-for="item in eraNetworks.filter((e) => !e.hidden)"
          :key="item.key"
          v-slot="{ active }"
          as="template"
        >
          <button class="network-dropdown-item" :class="{ active }" @click="buttonClicked(item)">
            <IconsEra class="network-dropdown-item-img" />
            <span>{{ item.name }}</span>
            <CheckIcon v-if="isNetworkSelected(item)" class="network-dropdown-item-icon" aria-hidden="true" />
            <div v-else class="network-dropdown-item-icon"></div>
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useNetworks from "@/composables/useNetworks";

import type { L2Network } from "@/data/networks";

import { useRoute } from "#app";
import { useNetworkStore } from "@/store/network";
import { getNetworkUrl } from "@/utils/helpers";

const route = useRoute();

const { eraNetworks } = useNetworks();
const { selectedNetwork } = storeToRefs(useNetworkStore());

const isNetworkSelected = (network: L2Network) => selectedNetwork.value.key === network.key;

const buttonClicked = (network: L2Network) => {
  if (isNetworkSelected(network)) {
    return;
  }
  window.location.href = getNetworkUrl(network, route.fullPath);
};
</script>

<style lang="scss" scoped>
.network-dropdown-container {
  @apply relative;

  .network-dropdown-item {
    @apply flex items-center gap-2;

    .network-dropdown-item-img {
      @apply h-6 w-6 flex-shrink-0;
    }
    .network-dropdown-item-icon {
      @apply ml-auto h-6 w-6 flex-shrink-0 transition;
      &.opened {
        @apply rotate-180;
      }
    }
  }
  .network-options-container {
    @apply absolute right-0 top-full z-10 mt-0.5 grid h-max w-max min-w-full rounded-3xl bg-white p-1 shadow-lg dark:bg-neutral-900;

    .network-dropdown-item {
      @apply rounded-3xl p-3 text-left transition;
      &.active {
        @apply bg-neutral-800;
      }
    }
  }
}
</style>
