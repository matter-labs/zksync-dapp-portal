<template>
  <Menu as="div" class="account-dropdown-container" v-slot="{ open }">
    <MenuButton as="template">
      <CommonButton class="account-dropdown-item">
        <AddressAvatar :address="account.address!" class="account-dropdown-item-img" />
        <span ref="addressEl">{{ shortenAddress(account.address!) }}</span>
        <ChevronDownIcon class="account-dropdown-item-icon" :class="{ opened: open }" aria-hidden="true" />
      </CommonButton>
    </MenuButton>

    <transition v-bind="TransitionAlertScaleInOutTransition">
      <MenuItems class="account-options-container">
        <MenuItem v-slot="{ active }" as="template">
          <button class="account-dropdown-item" :class="{ active }" @click="copy()">
            <DocumentDuplicateIcon class="account-dropdown-item-img" />
            <span>Copy address</span>
          </button>
        </MenuItem>
        <MenuItem v-if="selectedNetwork.blockExplorerUrl" v-slot="{ active }" as="template">
          <a
            :href="`${selectedNetwork.blockExplorerUrl}/address/${account.address!}`"
            target="_blank"
            class="account-dropdown-item"
            :class="{ active }"
          >
            <Squares2X2Icon class="account-dropdown-item-img" />
            <span>Explorer</span>
            <ArrowTopRightOnSquareIcon class="account-dropdown-item-icon" aria-hidden="true" />
          </a>
        </MenuItem>
        <MenuItem v-slot="{ active }" as="template">
          <button class="account-dropdown-item" :class="{ active }">
            <ExclamationCircleIcon class="account-dropdown-item-img" />
            <span>Help</span>
          </button>
        </MenuItem>
        <MenuItem v-slot="{ active }" as="template">
          <button class="account-dropdown-item" :class="{ active }" @click="onboardStore.disconnect()">
            <PowerIcon class="account-dropdown-item-img" />
            <span>Logout</span>
          </button>
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
  ChevronDownIcon,
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

  .account-dropdown-item {
    @apply flex items-center gap-2;

    .account-dropdown-item-img {
      @apply h-6 w-6 flex-shrink-0;
    }
    .account-dropdown-item-icon {
      @apply ml-auto h-6 w-6 flex-shrink-0 transition;
      &.opened {
        @apply rotate-180;
      }
    }
  }
  .account-options-container {
    @apply absolute right-0 top-full z-10 mt-0.5 grid h-max w-max min-w-full rounded-3xl bg-white p-1 shadow-lg dark:bg-neutral-900;

    .account-dropdown-item {
      @apply rounded-3xl p-3 text-left transition;
      &.active {
        @apply bg-neutral-800;
      }
    }
  }
}
</style>
