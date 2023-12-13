<template>
  <CommonContentBlock>
    <p class="text-center">Connect your wallet to view balances, bridge, and send assets with zkSync.</p>
    <CommonButton variant="primary-solid" class="mt-block-gap" @click="onboardStore.openModal()">
      Connect wallet
    </CommonButton>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
</script>
