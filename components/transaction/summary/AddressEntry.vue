<template>
  <CommonButtonLine as="div" class="transaction-summary-address-entry">
    <div class="entry-label">{{ label }}</div>
    <div class="entry-info">
      <div class="entry-text-info">
        <div class="account-label">{{ accountLabel }}</div>
        <div class="account-address">
          <span
            v-for="(part, index) in addressParts"
            :key="index"
            :class="{ 'text-neutral-600 dark:text-neutral-400': index === 1 }"
          >
            {{ part }}
          </span>
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
const addressParts = computed<[string, string, string]>(() => {
  const address = props.address;
  return [address.slice(0, 5), address.slice(5, 39), address.slice(39)];
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
        @apply break-all text-sm;
      }
    }
    .account-avatar {
      @apply h-12 w-12 shrink-0;
    }
  }
}
</style>
