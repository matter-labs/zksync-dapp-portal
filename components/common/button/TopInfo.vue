<template>
  <component :is="as" class="button-top-info">
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
});
</script>

<style lang="scss" scoped>
.button-top-info {
  @apply mx-auto mb-2 flex w-full items-center justify-center text-center text-sm text-gray-secondary wrap-balance dark:text-neutral-400;
}
</style>
