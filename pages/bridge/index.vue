<template>
  <ModalTransactionDepositUnavailable />

  <div class="mb-2.5 flex items-center space-x-1 pl-3.5 text-left text-sm text-neutral-300">
    <span>From</span>
    <DestinationLabel :label="destinations.ethereum.label" :icon="IconsEthereum" />
  </div>
  <EraDepositForm layout="bridge" :address="address">
    <template #form>
      <template v-if="address">
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            as="button"
            type="button"
            :icon="PencilIcon"
            :address="address"
            :destination="destinations.era"
            :tooltip="`Deposit to ${destinations.era.label}`"
            @click="emit('select-address')"
          />
        </CommonCardWithLineButtons>
      </template>
    </template>
  </EraDepositForm>
</template>

<script lang="ts" setup>
import { ArrowDownIcon, PencilIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import IconsEthereum from "@/components/icons/Ethereum.vue";

import { definePageMeta } from "#imports";
import { useDestinationsStore } from "@/store/destinations";
import EraDepositForm from "@/views/zksync/era/transactions/Deposit.vue";

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
