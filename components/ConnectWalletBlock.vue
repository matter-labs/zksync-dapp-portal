<template>
  <CommonContentBlock>
    <p class="text-center">
      <slot />
    </p>
    <CommonButton variant="primary" class="mt-block-gap w-full" @click="onboardStore.openModal()">
      Connect wallet
    </CommonButton>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
</script>
