<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>

<script lang="ts" setup>
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
