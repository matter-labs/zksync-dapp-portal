<template>
  <Menu as="div" class="account-dropdown-container" v-slot="{ open }">
    <MenuButton as="template">
      <CommonButtonDropdown :toggled="open">
        <template #left-icon>
          <AddressAvatar :address="account.address!" class="h-full w-full" />
        </template>
        <span ref="addressEl">{{ shortenAddress(account.address!) }}</span>
      </CommonButtonDropdown>
    </MenuButton>

    <transition v-bind="TransitionAlertScaleInOutTransition">
      <MenuItems class="account-options-container">
        <MenuItem v-slot="{ active }" as="template">
          <CommonButtonDropdown size="sm" no-chevron :active="active" @click="copy()">
            <template #left-icon>
              <DocumentDuplicateIcon aria-hidden="true" />
            </template>
            <span>Copy address</span>
          </CommonButtonDropdown>
        </MenuItem>
        <MenuItem v-if="selectedNetwork.blockExplorerUrl" v-slot="{ active }" as="template">
          <CommonButtonDropdown
            size="sm"
            no-chevron
            :active="active"
            as="a"
            :href="`${selectedNetwork.blockExplorerUrl}/address/${account.address!}`"
            target="_blank"
          >
            <template #left-icon>
              <Squares2X2Icon aria-hidden="true" />
            </template>
            <span>Explorer</span>
            <template #right-icon>
              <ArrowTopRightOnSquareIcon aria-hidden="true" />
            </template>
          </CommonButtonDropdown>
        </MenuItem>
        <MenuItem v-slot="{ active }" as="template">
          <CommonButtonDropdown size="sm" no-chevron :active="active">
            <template #left-icon>
              <ExclamationCircleIcon aria-hidden="true" />
            </template>
            <span>Help</span>
          </CommonButtonDropdown>
        </MenuItem>
        <MenuItem v-slot="{ active }" as="template">
          <CommonButtonDropdown size="sm" no-chevron :active="active" @click="onboardStore.disconnect()">
            <template #left-icon>
              <PowerIcon aria-hidden="true" />
            </template>
            <span>Logout</span>
          </CommonButtonDropdown>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useTippy } from "vue-tippy";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
  PowerIcon,
  Squares2X2Icon,
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useCopy from "@/composables/useCopy";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);
const { selectedNetwork } = storeToRefs(useNetworkStore());

const { copy, copied } = useCopy(computed(() => account.value.address!));
const addressEl = ref<HTMLElement | undefined>();
const tooltip = useTippy(addressEl, {
  content: "Address copied!",
  trigger: "manual",
  hideOnClick: false,
  offset: [0, 25],
});
watch(
  copied,
  (copied) => {
    if (copied) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.account-dropdown-container {
  @apply relative;

  .account-options-container {
    @apply absolute right-0 top-full z-10 mt-0.5 grid h-max w-max min-w-full rounded-3xl bg-white p-1 shadow-lg dark:bg-neutral-900;
  }
}
</style>
