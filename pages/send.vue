<template>
  <EraTransferForm type="transfer">
    <template #title>
      <PageTitle :fallback-route="{ name: 'send-methods' }">Send to another address</PageTitle>
    </template>
  </EraTransferForm>
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
