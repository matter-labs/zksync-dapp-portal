<template>
  <Vue3Lottie class="idle-faucet-animation" :animation-data="ProgressFaucet" loop />
</template>

<script lang="ts" setup>
import ProgressFaucet from "@/assets/lottie/idle-faucet.json";
</script>

<style lang="scss">
.idle-faucet-animation {
  .text-colored path {
    @apply fill-neutral-950 dark:fill-white;
  }
}
</style>
