<template>
  <CommonImageLoader :src="iconUrl" :alt="`${symbol} token icon`" class="token-image-container">
    <template #placeholder>
      <div class="token-placeholder"></div>
    </template>
  </CommonImageLoader>
</template>

<script lang="ts" setup>
defineProps({
  symbol: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  iconUrl: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.token-image-container {
  @apply aspect-square;

  .token-placeholder {
    @apply h-full w-full rounded-full border border-dashed dark:border-neutral-600;
    &::before {
      content: "";
      @apply absolute inset-0 m-[3px] rounded-full bg-gray-100 dark:bg-neutral-700;
    }
  }
}
</style>
