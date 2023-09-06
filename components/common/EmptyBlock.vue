<template>
  <div class="empty-block">
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.empty-block {
  @apply break-words rounded-3xl border border-dashed px-3.5 py-4 text-center leading-normal text-gray-500 wrap-balance dark:border-neutral-500 dark:text-neutral-300;
}
</style>
