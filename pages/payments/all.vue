<template>
  <BackButton :fallback="{ name: 'payments' }" />
  <CommonPage title="All transactions">
    <template #era>
      <AllTransactionsEra />
    </template>
    <template #lite>
      <AllTransactionsLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import AllTransactionsEra from "@/views/zksync/era/payments/All.vue";
import AllTransactionsLite from "@/views/zksync/lite/payments/All.vue";
</script>

<style lang="scss" scoped></style>
