<template>
  <CommonModal
    v-if="!transactionStarted"
    v-bind="$attrs"
    :close-on-background-click="status === 'not-started'"
    class="allowance-transaction-modal"
    title="Allowance"
  >
    <div class="flex h-full flex-col overflow-auto">
      <template v-if="transaction">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="account.address!"
            :destination="destinations.ethereum"
            :tooltip="`Approve allowance for ${destination.label}`"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="LockOpenIcon" />
        <CommonCardWithLineButtons>
          <TokenBalance v-bind="transaction.token" as="div" :amount="transaction.amount" amount-display="full" />
          <DestinationItem v-bind="destination" as="div" description="Approving allowance for deposit" />
        </CommonCardWithLineButtons>
      </template>
      <CommonAlert class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Allowance lets you safely authorize the deposit process to access a specific amount of your tokens. No funds
          will be deducted after signing, except for
          <span class="font-medium">{{ destinations.ethereum.label }}</span> transaction fee
        </p>
        <a :href="TOKEN_ALLOWANCE" target="_blank" class="alert-link">
          Learn more
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>

      <TransactionConfirmModalFooter>
        <div v-if="error" class="mx-4">
          <CommonErrorBlock :retry-button="false" class="mt-3">
            {{ error.message }}
          </CommonErrorBlock>
        </div>
        <CommonButton
          :disabled="status !== 'not-started'"
          class="mx-auto mt-3"
          variant="primary-solid"
          @click="makeTransaction"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span v-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
            <span v-else>Approve allowance</span>
          </transition>
        </CommonButton>
        <TransactionButtonUnderlineConfirmTransaction :opened="status === 'waiting-for-signature'" />
      </TransactionConfirmModalFooter>
    </div>
  </CommonModal>

  <CommonModal
    v-else
    v-bind="$attrs"
    :closable="transactionCommitted"
    :close-on-background-click="false"
    class="allowance-transaction-successful-modal"
    title=""
    @after-leave="checkAfterModalClose"
  >
    <template #animation>
      <AnimationsProgressBlocks v-if="!transactionCommitted" class="mt-4 w-64" />
      <Vue3Lottie v-else class="w-32" :animation-data="SuccessUnlock" :loop="false" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">
        {{ transactionCommitted ? "Allowance approved" : "Approving allowance" }}
      </div>
      <CommonCardWithLineButtons v-if="transaction">
        <TransactionLineItem
          :icon="LockOpenIcon"
          :explorer-url="l1BlockExplorerUrl"
          :transaction-hash="(transactionHash as string)"
        >
          <template #top-left>Allowance</template>
          <template #top-right>
            <TokenAmount :token="transaction.token" :amount="transaction.amount" />
          </template>
          <template #bottom-right>Approved amount</template>
        </TransactionLineItem>
      </CommonCardWithLineButtons>

      <CommonAlert v-if="!transactionCommitted" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Please wait until <span class="font-medium">{{ transaction?.token.symbol }}</span> allowance transaction for
          <span class="font-medium">{{ destination.label }}</span> is committed on
          <span class="font-medium">{{ destinations.ethereum.label }}</span
          >.
        </p>
        <a
          v-if="l1BlockExplorerUrl"
          :href="`${l1BlockExplorerUrl}/tx/${transactionHash}`"
          target="_blank"
          class="alert-link"
        >
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
      <CommonAlert v-else class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Allowance for <span class="font-medium">{{ transaction?.token.symbol }}</span> is successfully approved for
          <span class="font-medium">{{ destination.label }}</span> network. You can now proceed with the deposit
        </p>
      </CommonAlert>

      <transition v-bind="TransitionAlertScaleInOutTransition">
        <TransactionConfirmModalFooter v-if="transactionCommitted">
          <CommonButton class="mx-auto mt-4" variant="primary-solid" @click="emit('continue')">Continue</CommonButton>
        </TransactionConfirmModalFooter>
      </transition>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ArrowUpRightIcon, InformationCircleIcon, LockOpenIcon } from "@heroicons/vue/24/outline";
import { getPublicClient } from "@wagmi/core";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/lineItem/TokenAmount.vue";

import usePromise from "@/composables/usePromise";

import SuccessUnlock from "@/assets/lottie/success-unlock.json";

import type { TransactionDestination } from "@/store/destinations";
import type { Hash, Token } from "@/types";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { TOKEN_ALLOWANCE } from "@/utils/doc-links";
import { formatError } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  token: Token;
  amount: BigNumberish;
};

const props = defineProps({
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
  transaction: {
    type: Object as PropType<ConfirmationModalTransaction>,
  },
  getAllowance: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
  setAllowance: {
    type: Function as PropType<() => Promise<Hash>>,
    required: true,
  },
  fetchBalance: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "continue"): void;
}>();

const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { l1BlockExplorerUrl } = storeToRefs(useNetworkStore());

const status = ref<"not-started" | "waiting-for-signature" | "committing" | "processing" | "done">("not-started");
const transactionHash = ref<Hash | undefined>();
const transactionCommitted = computed(() => status.value === "done");
const transactionStarted = computed(() => status.value === "committing" || transactionCommitted.value);

const { execute: makeTransaction, error } = usePromise(
  async () => {
    try {
      status.value = "waiting-for-signature";
      transactionHash.value = await props.setAllowance();

      status.value = "committing";

      const publicClient = getPublicClient();
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash.value,
        onReplaced: (replacement) => {
          transactionHash.value = replacement.transaction.hash;
        },
      });
      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      await Promise.all([props.fetchBalance(), props.getAllowance()]);
      status.value = "done";
    } catch (err) {
      status.value = "not-started";
      const error = formatError(err as Error);
      if (error) throw error;
    }
  },
  { cache: false }
);

const checkAfterModalClose = () => {
  if (status.value === "done") {
    reset();
  }
};
const reset = () => {
  status.value = "not-started";
  transactionHash.value = undefined;
};
</script>

<style lang="scss">
.allowance-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
.allowance-transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
