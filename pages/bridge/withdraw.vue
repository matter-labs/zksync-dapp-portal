<template>
  <ModalTransactionWithdrawalUnavailable />

  <div v-if="withdrawalsDisabled">
    <PageTitle>Bridge</PageTitle>
    <CommonAlert variant="warning" :icon="ExclamationTriangleIcon" class="mb-block-gap">
      <p>
        Bridging from {{ eraNetwork.name }} is temporarily disabled because of undergoing upgrade, expected to be
        completed by June 7th, 15:00 UTC. Please check back later. For more details, visit the
        <a
          href="https://github.com/zkSync-Community-Hub/zksync-developers/discussions/519"
          target="_blank"
          class="underline underline-offset-2"
          >upgrade information page</a
        >.
      </p>
    </CommonAlert>

    <div class="mt-5 flex flex-wrap items-center justify-center gap-block-gap">
      <CommonButton as="RouterLink" :to="{ name: 'assets' }" size="xs">Go to Assets page</CommonButton>
      <CommonButton size="xs" as="RouterLink" :to="{ name: 'bridge' }">Bridge to {{ eraNetwork.name }}</CommonButton>
    </div>
  </div>
  <TransferView v-else type="withdrawal" />
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

import { bridge as bridgeMeta } from "@/data/meta";
import { useZkSyncProviderStore } from "@/store/zksync/provider";
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

const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const withdrawalsDisabled = computed(() => false);
</script>

<style lang="scss" scoped></style>
