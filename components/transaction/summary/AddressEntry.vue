<template>
  <CommonButtonLine as="div" class="transaction-summary-address-entry">
    <div class="entry-label">{{ label }}</div>
    <div class="entry-info">
      <div class="entry-text-info">
        <div class="account-label">{{ accountLabel }}</div>
        <div v-tooltip="{ content: address, maxWidth: 'none' }" class="account-address">
          {{ shortenAddress(address, 6) }}
        </div>
      </div>
      <AddressAvatar class="account-avatar" :address="address">
        <template #icon>
          <img v-tooltip="destination.label" :src="destination.iconUrl" :alt="destination.label" />
        </template>
      </AddressAvatar>
    </div>
  </CommonButtonLine>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";

import { useOnboardStore } from "@/store/onboard";
import { shortenAddress } from "@/utils/formatters";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
});

const { account } = storeToRefs(useOnboardStore());

const accountLabel = computed(() => {
  if (props.address === account.value.address) {
    return `Your ${props.destination.label} account`;
  }
  return `Another ${props.destination.label} account`;
});
</script>

<style lang="scss" scoped>
.transaction-summary-address-entry {
  @apply flex items-center gap-4;

  .entry-label {
    @apply font-bold;
  }
  .entry-info {
    @apply ml-auto flex gap-4;

    .entry-text-info {
      @apply text-right;

      .account-address {
        @apply ml-auto w-max break-all;
      }
    }
    .account-avatar {
      @apply h-12 w-12 shrink-0;
    }
  }
}
</style>
