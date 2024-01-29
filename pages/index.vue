<template>
  <ModalTransactionDepositUnavailable />

  <div v-if="depositDisabled">
    <PageTitle>Bridge</PageTitle>
    <CommonAlert variant="warning" :icon="ExclamationTriangleIcon" class="mb-block-gap">
      <p>
        We are updating our systems. To prevent any inconveniences, bridging to
        {{ eraNetwork.name }} is temporarily disabled. Please check back in 15-30 minutes.
      </p>
    </CommonAlert>

    <div class="mt-5 flex flex-wrap items-center justify-center gap-block-gap">
      <CommonButton as="RouterLink" :to="{ name: 'assets' }" size="xs">Go to Assets page</CommonButton>
      <CommonButton size="xs" as="RouterLink" :to="{ name: 'withdraw' }">
        Bridge to {{ destinations.ethereum.label }}
      </CommonButton>
    </div>
  </div>
  <DepositView v-else />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
import DepositView from "@/views/transactions/Deposit.vue";

const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const depositDisabled = computed(() => eraNetwork.value.key === "mainnet");
</script>

<style lang="scss" scoped></style>
