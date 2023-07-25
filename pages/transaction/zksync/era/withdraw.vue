<template>
  <ModalTransactionWithdrawalUnavailable />

  <BackButton :fallback="{ name: 'transaction-zksync-era' }" />
  <SelectAddress
    v-if="step === 'address'"
    :destination="destinations.ethereum"
    :destination-tooltip="`Withdraw to ${destinations.ethereum.label}`"
    own-address-displayed
    @selected="queryAddress = $event"
  />
  <EraTransferForm v-else-if="step === 'transaction-form'" type="withdrawal" :address="address!" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useRouteQuery } from "@vueuse/router";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import EraTransferForm from "@/views/zksync/era/transactions/Transfer.vue";

const { destinations } = storeToRefs(useDestinationsStore());

const queryAddress = useRouteQuery("address", undefined, {
  transform: String,
  mode: "push",
});

const address = computed(() => {
  if (isAddress(queryAddress.value)) {
    return checksumAddress(queryAddress.value);
  }
  return undefined;
});

const step = computed<"address" | "transaction-form">(() => {
  if (!address.value) {
    return "address";
  }
  return "transaction-form";
});
</script>

<style lang="scss" scoped></style>
