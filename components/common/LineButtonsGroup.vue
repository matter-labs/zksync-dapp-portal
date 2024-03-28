<template>
  <div class="line-buttons-group" :class="{ 'has-margin-x': marginX, 'has-margin-y': marginY, 'has-gap': gap }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  marginX: {
    type: Boolean,
    default: true,
  },
  marginY: {
    type: Boolean,
    default: true,
  },
  gap: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.line-buttons-group {
  &.has-margin-x {
    @apply -mx-block-padding-1/4 sm:-mx-block-padding-1/2;
  }
  &.has-margin-y {
    @apply -my-block-padding-1/2;
  }
  &.has-gap {
    @apply space-y-block-padding-1/2;
  }
}
</style>
