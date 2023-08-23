<template>
  <TransactionPreviousDropdown
    label="Recent withdrawals"
    :active-transactions="withdrawalsNotCompletedAmount"
    :visible="visible"
  >
    <WithdrawalLineWithStatus v-for="(item, index) in recentWithdrawals" :key="index" :transfer="item" display-date />
  </TransactionPreviousDropdown>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import { storeToRefs } from "pinia";

import WithdrawalLineWithStatus from "./WithdrawalLineWithStatus.vue";

import { useOnboardStore } from "@/store/onboard";
import { useEraTransferStatusesStore } from "@/store/zksync/era/transfersStatuses";

const onboardStore = useOnboardStore();
const eraTransferStatusesStore = useEraTransferStatusesStore();
const { recentWithdrawals } = storeToRefs(eraTransferStatusesStore);

const visible = computed(() => {
  return recentWithdrawals.value.length > 0;
});
const withdrawalsNotCompletedAmount = computed(() => {
  return recentWithdrawals.value.filter((e) => !e.isCompleted).length;
});

const fetch = () => {
  eraTransferStatusesStore.checkRecentWithdrawals();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
