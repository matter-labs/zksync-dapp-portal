<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useRoute } from "vue-router";

import { useZkSyncWithdrawalsStore } from "@/store/zksync/withdrawals";
import { trackPage } from "@/utils/analytics";

useZkSyncWithdrawalsStore().updateWithdrawalsIfPossible(); // init store to update withdrawals

const route = useRoute();
watch(
  () => route.path,
  () => {
    trackPage();
  },
  { immediate: true }
);
</script>
