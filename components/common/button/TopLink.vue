<template>
  <component :is="as" class="button-top-link link">
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
});
</script>

<style lang="scss" scoped>
.button-top-link {
  @apply mx-auto mb-2 mt-2 flex w-full items-center justify-center text-center text-sm wrap-balance;
}
</style>
