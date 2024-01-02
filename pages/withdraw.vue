<template>
  <ModalTransactionWithdrawalUnavailable />

  <TransferView type="withdrawal">
    <template #title>
      <PageTitle>Bridge</PageTitle>
    </template>
  </TransferView>
</template>

<script lang="ts" setup>
import TransferView from "@/views/transactions/Transfer.vue";
</script>

<style lang="scss" scoped></style>
