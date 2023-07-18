<template>
  <EraTransferForm layout="bridge" type="withdrawal">
    <template #form>
      <template v-if="address">
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            as="button"
            type="button"
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
import { ArrowDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

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
