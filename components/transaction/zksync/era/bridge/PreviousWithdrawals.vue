<template>
  <PreviousTransactionsDropdown
    label="Recent withdrawals"
    :active-transactions="withdrawalsNotCompletedAmount"
    :visible="visible"
  >
    <WithdrawalLineWithStatus
      v-for="(item, index) in recentWithdrawals"
      :key="index"
      :transfer="item"
      display-date
      @timer-finished="() => updateWithdrawalStatus(item.transactionHash!, true)"
    />
  </PreviousTransactionsDropdown>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import PreviousTransactionsDropdown from "./PreviousTransactionsDropdown.vue";
import WithdrawalLineWithStatus from "./WithdrawalLineWithStatus.vue";

import useWithdrawalStatuses from "@/composables/zksync/era/bridge/withdrawalStatuses";

import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
const { recentWithdrawals, updateAllWithdrawalStatuses, updateWithdrawalStatus } = useWithdrawalStatuses();

const visible = computed(() => {
  return recentWithdrawals.value.length > 0;
});
const withdrawalsNotCompletedAmount = computed(() => {
  return recentWithdrawals.value.filter((e) => e.status === "not-completed").length;
});

const fetch = () => {
  updateAllWithdrawalStatuses();
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
