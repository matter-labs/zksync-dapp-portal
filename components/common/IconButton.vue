<template>
  <CommonContentLoader v-if="loading" class="icon-button" />
  <component v-else :is="as" type="button" class="icon-button" :class="[`variant-${variant}`]">
    <component :is="icon" class="icon-button-icon" aria-hidden="true" />
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  icon: {
    type: [Object, Function] as PropType<Component>,
  },
  variant: {
    type: String as PropType<"primary" | "primary-solid" | "error">,
    default: "primary",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.lite.dark {
  .icon-button {
    &.variant- {
      &primary {
        @apply bg-primary-400;
        &:enabled,
        &:is(a, label) {
          &:not([aria-disabled="true"]) {
            @apply hover:bg-primary-300;
          }
        }
      }
    }
  }
}
.icon-button {
  @apply flex aspect-square h-9 w-auto items-center justify-center rounded-full transition-colors;
  &:is(label) {
    @apply cursor-pointer;
  }
  &.variant- {
    &primary {
      @apply bg-primary-100/50 text-primary-400;
      @apply dark:bg-primary-300 dark:text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-100/75 dark:hover:bg-primary-200;
        }
      }
    }
  }

  .icon-button-icon {
    @apply h-4 w-4;
  }
}
</style>
