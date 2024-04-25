<template>
  <component :is="as" type="button" class="default-button" :class="[`size-${size}`, `variant-${variant}`]">
    <span v-if="$slots.icon" class="icon-container">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  variant: {
    type: String as PropType<"default" | "primary" | "light" | "error">,
    default: "default",
  },
  size: {
    type: String as PropType<"xs" | "sm" | "md">,
    default: "md",
  },
});
</script>

<style lang="scss">
.default-button {
  @apply flex items-center justify-center text-center backdrop-blur-sm transition-colors wrap-balance;
  &:is(label) {
    @apply cursor-pointer;
  }
  &.size- {
    &xs {
      @apply rounded-2xl px-4 py-2;
    }
    &sm {
      @apply rounded-[20px] p-3;
    }
    &md {
      @apply rounded-3xl p-4;
    }
  }
  &.variant- {
    &default {
      @apply bg-white dark:bg-neutral-900;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800;
        }
      }
    }
    &light {
      @apply bg-customGreyButton transition disabled:opacity-70 dark:bg-neutral-800;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-neutral-300 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700;
        }
      }
    }
    &primary {
      @apply bg-primary-custom px-6 text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-custom;
        }
      }
      &:disabled,
      &[aria-disabled="true"] {
        @apply bg-grayButtons dark:bg-neutral-800 dark:bg-opacity-50;
      }
    }
    &error {
      @apply bg-customError/10 text-red-400 dark:bg-customError dark:text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-red-100/75 dark:hover:bg-red-600;
        }
      }
    }
  }
  .icon-container {
    @apply -ml-0.5 mr-2 inline-flex items-center;

    svg {
      @apply block h-4 w-4;
    }
  }
}
</style>
