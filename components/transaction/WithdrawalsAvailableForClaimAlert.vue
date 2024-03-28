<template>
  <CommonHeightTransition :opened="!!withdrawalsAvailableForClaiming.length">
    <CommonAlert variant="warning" :icon="ExclamationTriangleIcon" class="mb-block-gap">
      <p>You have withdrawals available for claiming on {{ eraNetwork.l1Network?.name }} network</p>
      <CommonButton as="RouterLink" :to="{ name: 'transfers' }" variant="primary">
        <span class="whitespace-nowrap">See withdrawals</span>
      </CommonButton>
    </CommonAlert>
  </CommonHeightTransition>
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const { withdrawalsAvailableForClaiming } = storeToRefs(useZkSyncWithdrawalsStore());
</script>
