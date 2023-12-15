<template>
  <EraTransferForm
    type="transfer"
    title="Send to another address"
    :fallback-route="{ name: 'transaction-zksync-era' }"
  />
</template>

<script lang="ts" setup>
import EraTransferForm from "@/views/zksync/era/transactions/Transfer.vue";

/* const queryAddress = useRouteQuery("address", undefined, {
  transform: String,
  mode: "push",
});

const address = computed(() => {
  if (isAddress(queryAddress.value)) {
    return checksumAddress(queryAddress.value);
  }
  return undefined;
}); */
</script>

<style lang="scss" scoped></style>
