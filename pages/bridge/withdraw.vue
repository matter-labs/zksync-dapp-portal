<template>
  <ModalTransactionWithdrawalUnavailable />

  <EraTransferForm layout="bridge" type="withdrawal">
    <template #title>
      <PageTitle>Bridge</PageTitle>
      <BridgeNavigation />
    </template>
  </EraTransferForm>
</template>

<script lang="ts" setup>
import EraTransferForm from "@/views/zksync/era/transactions/Transfer.vue";
</script>

<style lang="scss" scoped></style>
