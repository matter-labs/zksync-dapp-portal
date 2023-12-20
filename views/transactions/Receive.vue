<template>
  <div>
    <CommonAlert variant="warning" :icon="ExclamationTriangleIcon" class="mb-block-padding-1/2 sm:mb-block-gap">
      Please ensure funds will be sent from an account on {{ eraNetwork.name }} network, otherwise it may result in the
      permanent loss of funds.
    </CommonAlert>
    <CommonContentBlock>
      <div class="grid gap-block-padding-1/2 sm:grid-cols-[max-content_1fr] sm:items-center sm:gap-block-padding">
        <CommonQrCodeStyled>
          <QrCode :value="address" :options="{ margin: 0, width: '100%', style: { padding: '0px' } }" />
        </CommonQrCodeStyled>
        <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div class="flex items-center gap-1 text-neutral-400">
            <IconsEra class="h-6 w-6" />
            <span>Your {{ eraNetwork.name }} address</span>
          </div>
          <div class="break-all sm:text-lg">{{ address }}</div>
          <CommonButton variant="primary" class="mt-block-padding-1/2 w-full" @click="copy()">
            <template v-if="copied">Copied!</template>
            <template v-else>
              <DocumentDuplicateIcon class="mr-1 h-6 w-6" aria-hidden="true" />
              Copy
            </template>
          </CommonButton>
        </div>
      </div>
    </CommonContentBlock>
    <!-- <CommonQrCodeStyled underline="Scan to copy address">
      <QrCode :value="address" :options="{ margin: 0, width: '100%', style: { padding: '0px' } }" />
    </CommonQrCodeStyled>
    <CommonCardWithLineButtons class="mt-4">
      <DestinationItem
        as="div"
        :label="`Your ${destination.label} address`"
        :description="shortenAddress(address, 5)"
        :icon-url="destination.iconUrl"
      >
        <template #right>
          <CommonButton variant="primary" @click="copy">
            <template #icon>
              <CheckIcon v-if="copied" aria-hidden="true" />
              <DocumentDuplicateIcon v-else aria-hidden="true" />
            </template>
            <template #default>{{ copied ? "Copied" : "Copy" }}</template>
          </CommonButton>
        </template>
      </DestinationItem>
      <CommonAlert variant="warning">
        <p>
          Please ensure to send funds to this address using
          <span class="font-medium">{{ destination.label }}</span> network, otherwise it may result in permanent loss of
          funds.
        </p>
      </CommonAlert>
    </CommonCardWithLineButtons> -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { DocumentDuplicateIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import useCopy from "@/composables/useCopy";

import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";

import { useZkSyncProviderStore } from "@/store/zksync/provider";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
});

const { copy, copied } = useCopy(computed(() => props.address));
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
</script>
