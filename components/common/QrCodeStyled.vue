<template>
  <div class="qr-code-styles-container">
    <div class="qr-code-container">
      <slot />
    </div>
    <p v-if="underline" class="qr-code-styled-underline">{{ underline }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  underline: {
    type: String,
  },
});
</script>

<style lang="scss">
.qr-code-styles-container {
  .qr-code-container {
    @apply mx-auto aspect-square h-36 w-36 rounded-xl bg-neutral-100 p-2 shadow-sm;

    & > * {
      width: 100% !important;
      height: 100% !important;
    }
  }
  .qr-code-styled-underline {
    @apply mt-1.5 text-center text-sm text-gray-secondary dark:text-neutral-400;
  }
}
</style>
