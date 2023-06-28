<template>
  <CommonPage title="Assets">
    <template #era>
      <AssetsEra />
    </template>
    <template #lite>
      <AssetsLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import AssetsEra from "@/views/zksync/era/Assets.vue";
import AssetsLite from "@/views/zksync/lite/Assets.vue";
</script>

<style lang="scss" scoped></style>
