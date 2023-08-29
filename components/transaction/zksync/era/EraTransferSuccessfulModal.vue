<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <template #animation>
      <AnimationsProgressPlane v-if="inProgress" class="w-72" />
      <Vue3Lottie v-else class="w-72" :animation-data="SuccessConfetti" :loop="false" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">
        {{ inProgress ? "Transaction submitted" : "Transaction completed" }}
      </div>
      <CommonCardWithLineButtons>
        <EraTransferLineItem :transfer="transfer" />
      </CommonCardWithLineButtons>

      <CommonAlert v-if="inProgress" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available at the
          <a
            v-if="blockExplorerUrl"
            :href="`${blockExplorerUrl}/address/${transfer.to}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >
          <span v-else>destination address</span>
          after the transaction is committed on the <span class="font-medium">{{ destinations.era.label }}</span
          >. You are free to close this page.
        </p>
        <a
          v-if="blockExplorerUrl"
          :href="`${blockExplorerUrl}/tx/${transfer.transactionHash}`"
          target="_blank"
          class="alert-link"
        >
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
      <CommonAlert v-else class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Your funds should now be available at the
          <a
            v-if="blockExplorerUrl"
            :href="`${blockExplorerUrl}/address/${transfer.to}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >
          <span v-else>destination address</span>.
        </p>
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

import EraTransferLineItem from "@/components/transaction/zksync/era/EraTransferLineItem.vue";

import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { EraTransfer } from "@/utils/zksync/era/mappers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useEraProviderStore } from "@/store/zksync/era/provider";

defineProps({
  transfer: {
    type: Object as PropType<EraTransfer>,
    required: true,
  },
  inProgress: {
    type: Boolean,
    default: true,
  },
});

const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl } = storeToRefs(useEraProviderStore());
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
