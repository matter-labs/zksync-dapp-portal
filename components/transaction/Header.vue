<template>
  <div class="transaction-header">
    <div class="transaction-header-info">
      <h1 class="transaction-header-title h1">{{ title }}</h1>
      <div class="transaction-header-address hidden xs:block" :title="address">{{ address }}</div>
      <div class="transaction-header-address xs:hidden" :title="address">
        {{ shortenAddress(address, 5) }}
      </div>
    </div>
    <AddressAvatar class="transaction-header-avatar" :address="address">
      <template #icon>
        <img v-tooltip="destinationTooltip" :src="destination.iconUrl" :alt="destination.label" />
      </template>
    </AddressAvatar>
  </div>
</template>

<script lang="ts" setup>
import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";

defineProps({
  title: {
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
  destinationTooltip: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.lite.dark {
  .transaction-header {
    .transaction-header-info {
      .transaction-header-address {
        @apply text-primary-300;
      }
    }
  }
}
.transaction-header {
  @apply flex items-center justify-between pb-6;

  .transaction-header-info {
    .transaction-header-title {
      @apply pb-1;
    }
    .transaction-header-address {
      @apply text-sm font-semibold text-primary-400 dark:text-primary-200;
    }
  }
  .transaction-header-avatar {
    @apply mt-5 h-14 w-14;
  }
}
</style>
