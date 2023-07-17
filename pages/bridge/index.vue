<template>
  <EraDepositForm layout="bridge">
    <template #form>
      <template v-if="address">
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            as="button"
            type="button"
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
import { ArrowDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

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
