<template>
  <CommonPage title="Transactions">
    <template #era>
      <TransactionsEra />
    </template>
    <template #lite>
      <TransactionsLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import TransactionsEra from "@/views/zksync/era/payments/Index.vue";
import TransactionsLite from "@/views/zksync/lite/payments/Index.vue";
</script>

<style lang="scss" scoped></style>
