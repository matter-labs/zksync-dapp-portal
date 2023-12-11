<template>
  <component :is="as" type="button" class="label-button">
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
});
</script>

<style lang="scss" scoped>
.label-button {
  @apply underline underline-offset-2 opacity-70 transition-opacity;
  &:enabled,
  &:is(a) {
    &:not([aria-disabled="true"]) {
      @apply hover:opacity-100;
    }
  }
}
</style>
