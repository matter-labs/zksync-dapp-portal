<template>
  <component :is="as" class="content-block-container" :class="`variant-${variant}`">
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  variant: {
    type: String as PropType<"default" | "primary">,
    default: "default",
  },
});
</script>

<style lang="scss" scoped>
.content-block-container {
  @apply block h-max w-full rounded-3xl px-block-padding-1/2 py-block-padding sm:px-block-padding;
  &.variant- {
    &default {
      @apply bg-neutral-100 dark:bg-neutral-900;
    }
    &primary {
      @apply bg-primary-400;
    }
  }
}
</style>
