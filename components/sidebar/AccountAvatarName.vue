<template>
  <component :is="isButton ? 'button' : 'div'" class="account-button" :class="{ 'is-button': isButton }">
    <AddressAvatar v-if="!avatar" :address="account.address!" class="account-icon" />
    <img v-else :src="avatar" class="account-icon aspect-square rounded-full" />
    <div class="account-name-container">
      <span class="account-name" :class="{ 'hidden xl:block': isButton }">
        {{ name ? name : shortenAddress(account.address!) }}
      </span>
      <ChevronDownIcon class="account-dropdown-icon" aria-hidden="true" />
      <button v-tooltip="copied ? 'Address copied' : 'Copy address'" class="copy-button" @click="copy">
        <DocumentDuplicateIcon v-if="!copied" class="copy-button-icon" aria-hidden="true" tabindex="-1" />
        <CheckIcon v-else class="copy-button-icon check-icon" aria-hidden="true" tabindex="-1" />
      </button>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { CheckIcon, ChevronDownIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useCopy from "@/composables/useCopy";

import { useEnsStore } from "@/store/ens";
import { useOnboardStore } from "@/store/onboard";
import { shortenAddress } from "@/utils/formatters";

defineProps({
  isButton: {
    type: Boolean,
    default: true,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { name, avatar } = storeToRefs(useEnsStore());

const accountAddress = computed(() => account.value.address || "");
const { copy, copied } = useCopy(accountAddress, 700);
</script>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-xl bg-transparent px-3 py-3;
  &.is-button {
    .copy-button {
      @apply hidden;
    }
    .account-dropdown-icon {
      @apply block;
    }
    .account-name-container {
      @apply hidden xl:grid;
    }
  }

  .account-icon {
    @apply aspect-square h-8 w-8;
  }
  .account-dropdown-icon {
    @apply -mr-0.5 hidden h-5 w-5 text-gray-secondary dark:text-neutral-400;
  }
  .account-name-container {
    @apply ml-3 grid w-full grid-cols-[1fr_max-content] items-center justify-between;

    .account-name {
      @apply mr-auto w-full overflow-hidden text-ellipsis text-left font-medium leading-4 tracking-[-0.1px];
    }
    .copy-button {
      @apply rounded p-1 ring-primary-400;

      .copy-button-icon {
        @apply pointer-events-none h-5 w-5 text-gray-secondary dark:text-neutral-400;
        &.check-icon {
          @apply text-primary-400;
        }
      }
    }
  }
}
</style>
