<template>
  <EraTransferForm type="transfer">
    <template #title>
      <PageTitle :fallback-route="{ name: 'send-methods' }">Send to another address</PageTitle>
    </template>
  </EraTransferForm>
</template>

<script lang="ts" setup>
import EraTransferForm from "@/views/transactions/Transfer.vue";
</script>

<style lang="scss" scoped></style>
