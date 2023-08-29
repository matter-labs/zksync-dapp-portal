<template>
  <CommonModal
    :opened="status !== 'not-started'"
    :closable="status === 'done'"
    :close-on-background-click="false"
    title=""
    class="faucet-modal"
  >
    <template #animation>
      <AnimationsSuccessFaucet v-if="status === 'done'" class="w-80" />
      <AnimationsProgressFaucet v-else class="w-80" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">{{ status === "done" ? "Tokens sent" : "Sending tokens..." }}</div>

      <slot name="tokens" />

      <CommonAlert v-if="status === 'done'" class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Success! Your free test tokens are on their way and will be available on your account soon. Welcome to zkSync
          Era!
        </p>
      </CommonAlert>
      <CommonAlert v-else-if="status === 'processing'" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>Hold tight! We're processing your request for free test tokens</p>
      </CommonAlert>

      <template v-if="status === 'done'">
        <TransactionConfirmModalFooter v-if="faucetNetwork.key === selectedNetwork.key">
          <CommonButtonTopLink as="a" href="https://ecosystem.zksync.io" target="_blank">
            Explore zkSync Era ecosystem
            <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
          </CommonButtonTopLink>
          <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto" variant="primary-solid">
            Go to Assets page
          </CommonButton>
        </TransactionConfirmModalFooter>
        <TransactionConfirmModalFooter v-else>
          <CommonButtonTopInfo>Test tokens are available on {{ faucetNetwork.name }}</CommonButtonTopInfo>
          <CommonButton as="a" :href="getNetworkUrl(faucetNetwork, '/')" class="mx-auto" variant="primary-solid">
            Switch to {{ faucetNetwork.name }}
          </CommonButton>
        </TransactionConfirmModalFooter>
      </template>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import type { EraNetwork } from "@/data/networks";
import type { PropType } from "vue";

import { useNetworkStore } from "@/store/network";

export type FaucetStep = "not-started" | "processing" | "done";

defineProps({
  faucetNetwork: {
    type: Object as PropType<EraNetwork>,
    required: true,
  },
  status: {
    type: String as PropType<"not-started" | "processing" | "done">,
    required: true,
  },
});

const { selectedNetwork } = storeToRefs(useNetworkStore());
</script>

<style lang="scss">
.faucet-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
