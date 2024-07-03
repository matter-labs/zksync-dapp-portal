<template>
  <ModalTransactionDepositUnavailable />

  <div v-if="depositsDisabled">
    <PageTitle>Bridge</PageTitle>
    <CommonAlert variant="warning" :icon="ExclamationTriangleIcon" class="mb-block-gap">
      <p>
        Bridging to {{ eraNetwork.name }} is temporarily disabled because of undergoing upgrade, expected to be
        completed by June 6th, 22:00 UTC. Please check back later. For more details, visit the
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
    </div>
  </div>
  <DepositView v-else />
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

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

const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const depositsDisabled = computed(() => false);
</script>

<style lang="scss" scoped></style>
