<template>
  <Vue3Lottie class="progress-plane-animation" :animation-data="ProgressPlane" loop />
</template>

<script lang="ts" setup>
import ProgressPlane from "@/assets/lottie/progress-plane.json";
</script>

<style lang="scss">
.progress-plane-animation {
  #plane path {
    @apply fill-white dark:fill-neutral-950;
  }
  .primary-colored path {
    @apply stroke-primary-400;
  }
}
</style>
