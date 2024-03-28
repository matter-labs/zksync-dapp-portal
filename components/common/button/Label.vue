<template>
  <component :is="as" type="button" class="label-button" :class="`variant-${variant}`" :interactive="interactive">
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
    type: String as PropType<"default" | "light">,
    default: "default",
  },
  interactive: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.label-button {
  @include interactiveStyles {
    @apply underline underline-offset-2 transition;
  }
  &.variant- {
    &default {
      @apply text-neutral-600 dark:text-neutral-500;
      @include interactiveStyles {
        @apply hover:text-neutral-950 dark:hover:text-white;
      }
    }
    &light {
      @apply text-neutral-700 dark:text-neutral-400;
      @include interactiveStyles {
        @apply hover:text-neutral-950 dark:hover:text-white;
      }
    }
  }
}
</style>
