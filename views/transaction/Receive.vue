<template>
  <div>
    <CommonQrCodeStyled underline="Scan to copy address">
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
          <CommonButton @click="copy">
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
          Please transfer funds to this address using
          <span class="font-medium">{{ destination.label }}</span> to successfully receive them
        </p>
      </CommonAlert>
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/outline";

import useCopy from "@/composables/useCopy";

import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";

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
</script>
