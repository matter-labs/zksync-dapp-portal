<template>
  <CommonButton class="back-button">
    <ArrowLeftIcon class="back-button-icon" aria-hidden="true" />
  </CommonButton>
</template>

<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";
</script>

<style lang="scss" scoped>
.back-button {
  .back-button-icon {
    @apply h-6 w-6;
  }
}
</style>
