<template>
  <Menu as="div" class="network-dropdown-container" v-slot="{ open }">
    <MenuButton as="template">
      <CommonButtonDropdown :toggled="open">
        <template #left-icon>
          <IconsEra />
        </template>
        <span>{{ selectedNetwork.name }}</span>
      </CommonButtonDropdown>
    </MenuButton>

    <transition v-bind="TransitionAlertScaleInOutTransition">
      <MenuItems class="network-options-container">
        <MenuItem
          v-for="item in eraNetworks.filter((e) => !e.hidden)"
          :key="item.key"
          v-slot="{ active }"
          as="template"
        >
          <CommonButtonDropdown size="sm" no-chevron :active="{ active }" @click="buttonClicked(item)">
            <template #left-icon>
              <IconsEra />
            </template>
            <span>{{ item.name }}</span>
            <template #right-icon>
              <CheckIcon v-if="isNetworkSelected(item)" aria-hidden="true" />
            </template>
          </CommonButtonDropdown>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";
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

  .network-options-container {
    @apply absolute right-0 top-full z-10 mt-0.5 grid h-max w-max min-w-full rounded-3xl bg-neutral-100 p-1 shadow-lg dark:bg-neutral-900;
  }
}
</style>
