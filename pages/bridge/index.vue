<template>
  <ModalTransactionDepositUnavailable />

  <DepositView />
</template>

<script lang="ts" setup>
import { bridge as bridgeMeta } from "@/data/meta";
import DepositView from "@/views/transactions/Deposit.vue";

useSeoMeta({
  title: bridgeMeta.title,
  ogTitle: bridgeMeta.title,
  description: bridgeMeta.description,
  ogDescription: bridgeMeta.description,
  ogImage: bridgeMeta.previewImg.src,
  ogImageAlt: bridgeMeta.previewImg.alt,
  twitterImage: bridgeMeta.previewImg.src,
  twitterImageAlt: bridgeMeta.previewImg.alt,
  twitterCard: "summary_large_image",
});
</script>

<style lang="scss" scoped></style>
