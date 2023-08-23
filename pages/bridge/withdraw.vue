<template>
  <ModalTransactionWithdrawalUnavailable />

  <TransactionZksyncEraBridgePreviousWithdrawals class="mb-2.5" />

  <div class="mb-2.5 flex items-center space-x-1 pl-3.5 text-left text-sm text-neutral-300">
    <span>From</span>
    <DestinationLabel :label="destinations.era.label" :icon="IconsEra" />
  </div>

  <EraTransferForm layout="bridge" type="withdrawal" :address="address">
    <template #form>
      <template v-if="address">
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            as="button"
            type="button"
            :icon="PencilIcon"
            :address="address"
            :destination="destinations.ethereum"
            :tooltip="`Withdraw to ${destinations.ethereum.label}`"
            @click="emit('select-address')"
          />
        </CommonCardWithLineButtons>
      </template>
    </template>
  </EraTransferForm>
</template>

<script lang="ts" setup>
import { ArrowDownIcon, PencilIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import IconsEra from "@/components/icons/Era.vue";

import { definePageMeta } from "#imports";
import { useDestinationsStore } from "@/store/destinations";
import EraTransferForm from "@/views/zksync/era/transactions/Transfer.vue";

definePageMeta({ layout: "bridge" });

defineProps({
  address: {
    type: String,
  },
});

const { destinations } = storeToRefs(useDestinationsStore());

const emit = defineEmits<{
  (eventName: "select-address"): void;
}>();
</script>

<style lang="scss" scoped></style>
