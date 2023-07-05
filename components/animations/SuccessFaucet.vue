<template>
  <Vue3Lottie class="success-faucet-animation" :animation-data="SuccessFaucet" :loop="false" />
</template>

<script lang="ts" setup>
import SuccessFaucet from "@/assets/lottie/success-faucet.json";
</script>

<style lang="scss">
.success-faucet-animation {
  .text-colored path {
    @apply stroke-neutral-950 dark:stroke-white;
  }
  .box-filled path {
    @apply fill-neutral-950 dark:fill-white;
  }
}
</style>
