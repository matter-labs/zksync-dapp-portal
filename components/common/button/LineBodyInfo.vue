<template>
  <div class="button-line-body-info">
    <div v-if="$slots.label" class="button-line-body-info-label">
      <slot name="label" />
    </div>
    <div v-if="$slots.secondary" class="button-line-body-info-secondary">
      <slot name="secondary" />
    </div>
    <div v-if="$slots.underline" class="button-line-body-info-underline">
      <slot name="underline" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.button-line-body-info {
  @apply w-max max-w-full;

  .button-line-body-info-label,
  .button-line-body-info-secondary {
    @apply inline min-h-[1.5rem] overflow-hidden text-ellipsis align-middle;
  }
  .button-line-body-info-underline {
    @apply text-sm text-neutral-700 dark:text-neutral-400;
  }
}
</style>
