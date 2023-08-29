<template>
  <PreviousTransactionsDropdown
    label="Recent withdrawals"
    :active-transactions="withdrawalsNotCompletedAmount"
    :visible="visible"
  >
    <template #default="{ opened }">
      <WithdrawalLineWithStatus
        v-for="(item, index) in recentWithdrawals"
        :key="index"
        :transfer="item"
        display-date
        :tabindex="opened ? undefined : -1"
        @timer-finished="() => updateSingleWithdrawal(item.transactionHash!)"
      />
    </template>
  </PreviousTransactionsDropdown>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import { storeToRefs } from "pinia";

import PreviousTransactionsDropdown from "./PreviousTransactionsDropdown.vue";
import WithdrawalLineWithStatus from "./WithdrawalLineWithStatus.vue";

import useInterval from "@/composables/useInterval";
import useWithdrawalStatuses from "@/composables/zksync/era/bridge/withdrawalStatuses";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";

const onboardStore = useOnboardStore();
const { eraNetwork } = storeToRefs(useEraProviderStore());
const { recentWithdrawals, updateAllWithdrawalStatuses, updateWithdrawalStatus } = useWithdrawalStatuses();

const visible = computed(() => {
  return recentWithdrawals.value.length > 0;
});
const withdrawalsNotCompletedAmount = computed(() => {
  return recentWithdrawals.value.filter((e) => e.status === "not-completed").length;
});

const updateSingleWithdrawal = (transactionHash: string) => {
  if (!eraNetwork.value.blockExplorerApi) return;
  updateWithdrawalStatus(transactionHash, true);
};

const fetch = () => {
  if (!eraNetwork.value.blockExplorerApi) return;
  updateAllWithdrawalStatuses();
};
fetch();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetch();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetAutoUpdate();
  fetch();
});

onBeforeUnmount(() => {
  stopAutoUpdate();
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
