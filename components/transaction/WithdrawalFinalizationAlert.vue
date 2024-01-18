<template>
  <CommonAlert
    v-if="transaction.info.withdrawalFinalizationAvailable"
    variant="warning"
    :icon="ExclamationTriangleIcon"
    class="mb-4"
  >
    <p>
      You can finalize your withdrawal now. Finalizing will require paying the fee on the
      {{ eraNetwork.l1Network?.name }} network.
      <a
        v-if="l1BlockExplorerUrl && finalizeTransactionHash"
        :href="`${l1BlockExplorerUrl}/tx/${finalizeTransactionHash}`"
        target="_blank"
        class="inline-flex items-center gap-1 underline underline-offset-2"
      >
        View on Explorer
        <ArrowTopRightOnSquareIcon class="h-6 w-6" aria-hidden="true" />
      </a>
    </p>
    <CommonButton v-if="!isConnected" variant="primary" @click="onboardStore.openModal()">
      <span class="whitespace-nowrap">Connect wallet</span>
    </CommonButton>
    <CommonButton
      v-else
      variant="primary"
      :disabled="finalizeTransactionStatus !== 'not-started'"
      @click="commitTransaction()"
    >
      Claim
      <CommonSpinner v-if="finalizeTransactionStatus !== 'not-started'" class="-mr-1 ml-2 h-6 w-6" aria-hidden="true" />
    </CommonButton>
  </CommonAlert>
  <CommonAlert v-else variant="warning" :icon="ExclamationTriangleIcon" class="mb-4">
    <p>
      You will have to claim your withdrawal once it's processed. Claiming will require paying the fee on the
      {{ eraNetwork.l1Network?.name }} network.
    </p>
  </CommonAlert>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ArrowTopRightOnSquareIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useWithdrawalFinalization from "@/composables/zksync/useWithdrawalFinalization";

import type { TransactionInfo } from "@/store/zksync/transactionStatus";
import type { PropType } from "vue";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useZkSyncProviderStore } from "@/store/zksync/provider";

const props = defineProps({
  transaction: {
    type: Object as PropType<TransactionInfo>,
    required: true,
  },
});

const onboardStore = useOnboardStore();
const { l1BlockExplorerUrl } = storeToRefs(useNetworkStore());
const { isConnected } = storeToRefs(onboardStore);
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const {
  status: finalizeTransactionStatus,
  transactionHash: finalizeTransactionHash,
  commitTransaction,
} = useWithdrawalFinalization(computed(() => props.transaction));
</script>
