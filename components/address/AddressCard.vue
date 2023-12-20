<template>
  <CommonButtonLineWithImg :as="as" class="address-card">
    <template #image>
      <AddressAvatar class="address-card-avatar" :address="address">
        <template v-if="$slots['address-icon']" #icon>
          <slot name="address-icon" />
        </template>
      </AddressAvatar>
    </template>
    <template #default>
      <CommonButtonLineBodyInfo class="text-left">
        <template #label v-if="name">{{ name }}</template>
        <template #underline>
          <span class="block break-all" :title="address">{{ address }}</span>
        </template>
      </CommonButtonLineBodyInfo>
    </template>
    <template #right v-if="$slots.right">
      <slot name="right" />
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.address-card {
  .address-card-avatar {
    @apply aspect-square h-auto w-full;
  }
}
</style>
