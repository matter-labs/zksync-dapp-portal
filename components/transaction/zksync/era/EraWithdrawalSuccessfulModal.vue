<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <template #animation>
      <AnimationsProgressPlane class="w-72" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">Transaction submitted</div>
      <CommonCardWithLineButtons>
        <EraTransactionLineItem :transaction="transaction" />
      </CommonCardWithLineButtons>

      <CommonAlert class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available on the <span class="font-medium">{{ destinations.ethereum.label }}</span> after a
          <a :href="ERA_WITHDRAWAL_DELAY" target="_blank" class="link">~24-hour delay</a>. During this time, the
          transaction will be processed and finalized. You are free to close this page.
        </p>
        <a :href="ERA_WITHDRAWAL_DELAY" target="_blank" class="alert-link">
          Learn more
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>

      <TransactionConfirmModalFooter>
        <CommonButtonTopLink as="RouterLink" :to="{ name: 'transaction-zksync-era' }">
          Make another transaction
        </CommonButtonTopLink>
        <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto" variant="primary-solid">
          Go to Assets page
        </CommonButton>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import EraTransactionLineItem from "@/components/transaction/zksync/era/EraTransactionLineItem.vue";

import type { EraTransaction } from "@/utils/zksync/era/mappers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { ERA_WITHDRAWAL_DELAY } from "@/utils/doc-links";

defineProps({
  transaction: {
    type: Object as PropType<EraTransaction>,
    required: true,
  },
});

const { destinations } = storeToRefs(useDestinationsStore());
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
