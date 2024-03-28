<template>
  <ModalTransactionWithdrawalUnavailable />

  <TransferView type="withdrawal">
    <template #title>
      <PageTitle>Bridge</PageTitle>
    </template>
  </TransferView>
</template>

<script lang="ts" setup>
import { bridge as bridgeMeta } from "@/data/meta";
import TransferView from "@/views/transactions/Transfer.vue";

useSeoMeta({
  title: bridgeMeta.title,
  ogTitle: bridgeMeta.title,
  description: bridgeMeta.description,
  ogDescription: bridgeMeta.description,
  ogImage: bridgeMeta.previewImg.src,
  ogImageAlt: bridgeMeta.previewImg.alt,
  twitterCard: "summary_large_image",
  twitterImage: bridgeMeta.previewImg.src,
  twitterImageAlt: bridgeMeta.previewImg.alt,
});
</script>

<style lang="scss" scoped></style>
