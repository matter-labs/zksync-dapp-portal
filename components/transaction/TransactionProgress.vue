<template>
  <CommonContentBlock>
    <div class="transaction-progress">
      <template v-if="isSameAddressDifferentDestination">
        <div class="info-column left">
          <div class="flex flex-col items-center justify-center gap-1 md:flex-row">
            <span>From</span>
            <img
              v-tooltip="fromDestination.label"
              :src="fromDestination.iconUrl"
              :alt="fromDestination.label"
              class="h-6 w-6"
            />
          </div>
          <div>Your account {{ shortenAddress(fromAddress) }}</div>
        </div>
        <div class="info-column right">
          <div class="flex flex-col items-center justify-center gap-1 md:flex-row">
            <span>To</span>
            <img
              v-tooltip="toDestination.label"
              :src="toDestination.iconUrl"
              :alt="toDestination.label"
              class="h-6 w-6"
            />
          </div>
          <div>{{ isSameAddress ? "Your account" : "Another account" }} {{ shortenAddress(toAddress) }}</div>
        </div>
      </template>
      <template v-else>
        <div class="info-column left">
          <AddressAvatar class="mx-auto h-12 w-12" :address="fromAddress">
            <template #icon>
              <img v-tooltip="fromDestination.label" :src="fromDestination.iconUrl" :alt="fromDestination.label" />
            </template>
          </AddressAvatar>
          <div>
            From your account
            <br />
            {{ shortenAddress(fromAddress) }}
          </div>
        </div>
        <div class="info-column right">
          <AddressAvatar class="mx-auto h-12 w-12" :address="toAddress">
            <template #icon>
              <img v-tooltip="toDestination.label" :src="toDestination.iconUrl" :alt="toDestination.label" />
            </template>
          </AddressAvatar>
          <div>
            {{ isSameAddress ? "To your account" : "To another account" }}
            <br />
            {{ shortenAddress(toAddress) }}
          </div>
        </div>
      </template>

      <AnimationsTransactionProgress :completed="completed" class="transaction-animation" />
    </div>
    <CommonButton
      size="xs"
      variant="light"
      as="a"
      :href="transactionLink"
      target="_blank"
      class="mx-auto mt-block-gap w-max"
    >
      Explorer
      <ArrowTopRightOnSquareIcon class="-mr-1 ml-2 h-6 w-6" aria-hidden="true" />
    </CommonButton>
    <div class="mt-block-padding flex items-center justify-center">
      <span class="text-neutral-400">Value:</span>
      <span class="ml-1 flex items-center">
        {{ parseTokenAmount(token.amount, token.decimals) }}
        <TokenImage class="mx-1 h-5 w-5" v-bind="token" />
        {{ token.symbol }}
      </span>
    </div>
  </CommonContentBlock>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/outline";

import type { TransactionDestination } from "@/store/destinations";
import type { TokenAmount } from "@/types";
import type { PropType } from "vue";

const props = defineProps({
  fromAddress: {
    type: String,
    required: true,
  },
  fromDestination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
  toAddress: {
    type: String,
    required: true,
  },
  toDestination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
  transactionLink: {
    type: String,
    required: true,
  },
  token: {
    type: Object as PropType<TokenAmount>,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const isSameAddress = computed(() => props.fromAddress === props.toAddress);
const isSameAddressDifferentDestination = computed(
  () => isSameAddress.value && props.fromDestination.label !== props.toDestination.label
);
</script>

<style lang="scss" scoped>
.transaction-progress {
  @apply grid grid-cols-3 items-center gap-x-4 text-center;
  grid-template-areas: "info-col-left divider info-col-right";

  .info-column {
    @apply flex flex-col items-center justify-center gap-2;
    &.left {
      grid-area: info-col-left;
    }
    &.right {
      grid-area: info-col-right;
    }
  }
  .transaction-animation {
    grid-area: divider;
  }
  .divider {
    @apply relative border-t border-dashed border-neutral-500;
    grid-area: divider;

    .airplane {
      @apply absolute h-8 w-8;
      // create animation from left opacity 0 to center opacity 100 to right opacity 0
      // it should also scale from 0 to 1 to 0
      animation: airplane 3s linear infinite;
      @keyframes airplane {
        0% {
          left: 0;
          transform: translate(0, -50%) scale(0);
          opacity: 0;
        }
        30%,
        60% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          left: 100%;
          transform: translate(-100%, -50%) scale(0);
          opacity: 0;
        }
      }
    }
  }
}
</style>
