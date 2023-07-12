<template>
  <AddressCard as="div" :name="addressCard.name" :address="addressCard.address" :icon="addressCard.icon">
    <template #address-icon v-if="destination">
      <img v-tooltip="tooltip" :src="destination!.iconUrl" :alt="destination!.label" />
    </template>
  </AddressCard>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ClockIcon, UserIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";

import { useContactsStore } from "@/store/contacts";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
  },
  tooltip: {
    type: String,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { userContacts } = storeToRefs(useContactsStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());

const addressCard = computed(() => {
  if (props.address === account.value.address) {
    return {
      name: `Your${props.destination ? " " + props.destination.label : ""} account`,
      address: account.value.address,
      icon: UserIcon,
    };
  }
  const contact = userContacts.value.find((e) => e.address === props.address);
  if (props.address === previousTransactionAddress.value) {
    return {
      name: contact?.name ?? "Previous transaction address",
      address: props.address,
      icon: ClockIcon,
    };
  } else if (contact) {
    return {
      ...contact,
      icon: undefined,
    };
  }
  return {
    name: props.destination ? props.destination.label + " account" : "",
    address: props.address,
  };
});
</script>
