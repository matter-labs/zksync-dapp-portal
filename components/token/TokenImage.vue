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
  iconUrl: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.token-image-container {
  @apply aspect-square;

  .token-placeholder {
    @apply h-full w-full rounded-full border border-neutral-400 bg-neutral-200 dark:border-neutral-500 dark:bg-neutral-700;
  }
}
</style>
