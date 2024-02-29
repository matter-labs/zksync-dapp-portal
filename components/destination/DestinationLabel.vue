<template>
  <div class="destination-label">
    <component :is="icon" class="destination-label-img" />
    <div class="destination-label-text">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: [String, Object] as PropType<string | Component>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.destination-label {
  @apply flex items-center space-x-1 dark:text-white;
  .destination-label-img {
    @apply h-5 w-5;
  }
  .destination-label-text {
    @apply whitespace-nowrap text-left;
  }
}
</style>
