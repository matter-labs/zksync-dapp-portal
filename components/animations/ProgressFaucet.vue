<template>
  <Vue3Lottie class="progress-faucet-animation" :animation-data="ProgressFaucet" loop />
</template>

<script lang="ts" setup>
import ProgressFaucet from "@/assets/lottie/progress-faucet.json";
</script>

<style lang="scss">
.progress-faucet-animation {
  .text-colored path {
    @apply fill-neutral-950 dark:fill-white;
  }
}
</style>
