<template>
  <ModalTransactionWithdrawalUnavailable />

  <EraTransferForm type="withdrawal">
    <template #title>
      <PageTitle>Bridge</PageTitle>
    </template>
  </EraTransferForm>
</template>

<script lang="ts" setup>
import EraTransferForm from "@/views/transactions/Transfer.vue";
</script>

<style lang="scss" scoped></style>
