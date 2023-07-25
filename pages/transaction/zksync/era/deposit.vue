<template>
  <ModalTransactionDepositUnavailable />

  <BackButton :fallback="{ name: 'transaction-zksync-era-receive' }" />
  <SelectAddress
    v-if="step === 'address'"
    title="Where to add funds"
    :destination="destinations.era"
    :destination-tooltip="`Add funds to ${destinations.era.label}`"
    own-address-displayed
    @selected="queryAddress = $event"
  />
  <EraDepositForm v-else-if="step === 'transaction-form'" :address="address!" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useRouteQuery } from "@vueuse/router";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import EraDepositForm from "@/views/zksync/era/transactions/Deposit.vue";

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
