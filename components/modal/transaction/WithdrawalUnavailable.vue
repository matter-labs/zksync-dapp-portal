<template>
  <CommonModal :opened="!eraNetwork.l1Network" :closable="false" title="Withdrawal unavailable">
    <p class="leading-normal">
      Withdrawal is not available on <span class="font-medium">{{ eraNetwork.name }}</span> since it doesn't have L1
      network
    </p>
    <CommonButton as="RouterLink" :to="{ name: 'assets' }" replace variant="primary" class="mt-4 w-full">
      Go to Assets page
    </CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
</script>
