<template>
  <component
    :is="as"
    class="category-label"
    :class="[{ 'has-padding': padded, 'with-side-content': $slots.right }, `size-${size}`, `variant-${variant}`]"
  >
    <slot />
    <slot name="right" />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  padded: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<"md" | "sm">,
    default: "md",
  },
  variant: {
    type: String as PropType<"default" | "darker">,
    default: "default",
  },
});
</script>

<style lang="scss" scoped>
.category-label {
  &.has-padding {
    &.size- {
      &md {
        @apply my-block-gap;
      }
      &sm {
        @apply my-block-padding;
      }
    }
  }
  &.with-side-content {
    @apply flex justify-between gap-block-gap-1/2;
  }
  &.variant- {
    &darker {
      @apply text-neutral-700 dark:text-neutral-400;
    }
  }
}
</style>
