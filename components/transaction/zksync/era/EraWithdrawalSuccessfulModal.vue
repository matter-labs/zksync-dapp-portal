<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <template #animation>
      <AnimationsProgressPlane class="w-72" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">Transaction submitted</div>
      <CommonCardWithLineButtons>
        <EraTransferLineItem :transfer="transfer" />
      </CommonCardWithLineButtons>

      <CommonAlert v-if="!isCustomNode" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
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
      <CommonAlert v-else class="mt-3" variant="warning" :icon="InformationCircleIcon">
        <p>
          You might need to finalize this withdrawal manually to receive funds on
          <span class="font-medium">{{ destinations.ethereum.label }}</span>
        </p>
        <a :href="ERA_FINALIZE_WITHDRAWAL" target="_blank" class="alert-link">
          Learn more
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>

      <TransactionConfirmModalFooter>
        <template v-if="layout === 'default'">
          <CommonButtonTopLink as="RouterLink" :to="{ name: 'transaction-zksync-era' }">
            Make another transaction
          </CommonButtonTopLink>
          <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto" variant="primary-solid">
            Go to Assets page
          </CommonButton>
        </template>
        <template v-else-if="layout === 'bridge'">
          <CommonButtonTopLink v-if="!isCustomNode" @click="emit('newTransaction')">
            Make another transaction
          </CommonButtonTopLink>
          <CommonButton v-if="refererName" class="mx-auto" variant="primary-solid" @click="closeWindow">
            Go back to {{ refererName }}
          </CommonButton>
          <CommonButton
            v-else-if="!isCustomNode"
            as="a"
            href="https://ecosystem.zksync.io"
            target="_blank"
            class="mx-auto"
            variant="primary-solid"
          >
            Explore ecosystem
            <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" aria-hidden="true" />
          </CommonButton>
          <CommonButton v-else class="mx-auto" variant="primary-solid" @click="emit('newTransaction')">
            Make another transaction
          </CommonButton>
        </template>
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { useRouteQuery } from "@vueuse/router";
import { storeToRefs } from "pinia";

import EraTransferLineItem from "@/components/transaction/zksync/era/EraTransferLineItem.vue";

import useNetworks from "@/composables/useNetworks";

import type { EraTransfer } from "@/utils/zksync/era/mappers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { ERA_WITHDRAWAL_DELAY } from "@/utils/doc-links";

defineProps({
  layout: {
    type: String as PropType<"default" | "bridge">,
    default: "default",
  },
  transfer: {
    type: Object as PropType<EraTransfer>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "newTransaction"): void;
}>();

const { isCustomNode } = useNetworks();
const { destinations } = storeToRefs(useDestinationsStore());

const refererName = useRouteQuery("refererName");
const closeWindow = () => window.close();
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
