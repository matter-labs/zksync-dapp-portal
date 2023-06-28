<template>
  <div>
    <h1 class="h1">{{ title }}</h1>
    <CommonSmallInput v-model.trim="search" class="mb-4" placeholder="Address or ENS or contact name" autofocus>
      <template #icon>
        <MagnifyingGlassIcon aria-hidden="true" />
      </template>
      <template #right>
        <CommonQrUploadIconButton class="md:hidden" id="qr-code-input" @selected="emit('selected', $event)" />
      </template>
    </CommonSmallInput>
    <div v-if="displayedAddresses.length">
      <template v-for="(group, groupIndex) in displayedAddresses" :key="groupIndex">
        <TypographyCategoryLabel v-if="group.title" class="group-category-label">
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <AddressCard
            v-for="item in group.addresses"
            :name="item.name"
            :address="item.address"
            :icon="item.icon"
            :key="item.address"
            @click="emit('selected', item.address)"
          >
            <template #address-icon v-if="destination">
              <img v-tooltip="destinationTooltip" :src="destination!.iconUrl" :alt="destination!.label" />
            </template>
          </AddressCard>
        </CommonCardWithLineButtons>
      </template>
    </div>
    <div v-else-if="!search">
      <CommonEmptyBlock class="search-empty-block">
        Enter address in the search bar
        <br />
        <span class="mt-1.5 inline-block">
          Or <NuxtLink class="link" :to="{ name: 'contacts' }">create a contact</NuxtLink>
        </span>
      </CommonEmptyBlock>
    </div>
    <div v-else-if="ensParseInProgress">
      <CommonCardWithLineButtons>
        <AddressCardLoader />
      </CommonCardWithLineButtons>
    </div>
    <div v-else-if="ensParseError">
      <CommonErrorBlock @try-again="parseEns">
        {{ ensParseError }}
      </CommonErrorBlock>
    </div>
    <div v-else>
      <CommonEmptyBlock class="search-empty-block">
        Nothing was found for "{{ search }}"
        <br />
        <span class="mt-1.5 inline-block">Please enter a valid Ethereum address</span>
      </CommonEmptyBlock>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ClockIcon, MagnifyingGlassIcon, UserIcon } from "@heroicons/vue/24/outline";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import useEns from "@/composables/useEnsName";

import type { Contact } from "@/store/contacts";
import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";
import type { Component } from "vue";

import { useContactsStore } from "@/store/contacts";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { checksumAddress } from "@/utils/formatters";

type ContactWithIcon = Contact & { icon?: Component };
type AddressesGroup = { title: string | null; addresses: ContactWithIcon[] };

const props = defineProps({
  title: {
    type: String,
    default: "Who to pay",
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
  },
  destinationTooltip: {
    type: String,
  },
  ownAddressDisplayed: {
    type: Boolean,
  },
});

const emit = defineEmits<{
  (eventName: "selected", address: string): void;
}>();

const contactsStore = useContactsStore();
const { account } = storeToRefs(useOnboardStore());
const { userContacts, userContactsByFirstCharacter } = storeToRefs(contactsStore);
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());

const search = ref("");
const isAddressValid = computed(() => isAddress(search.value));
const { address: ensAddress, inProgress: ensParseInProgress, error: ensParseError, parseEns } = useEns(search);

function findContactsByText(contacts: ContactWithIcon[], text: string) {
  const lowercaseSearch = text.toLowerCase();
  return contacts.filter((item) =>
    Object.values(item)
      .filter((e) => typeof e === "string")
      .some((value) => (value as string).toLowerCase().includes(lowercaseSearch))
  );
}

const inputtedAddressAccount = computed<ContactWithIcon | null>(() => {
  if (ensAddress.value?.length) {
    return {
      name: search.value,
      address: checksumAddress(ensAddress.value),
    };
  } else if (isAddressValid.value) {
    return {
      name: "",
      address: checksumAddress(search.value),
    };
  }
  return null;
});
const ownAccount = computed<ContactWithIcon>(() => ({
  name: "Your account",
  address: account.value.address!,
  icon: UserIcon,
}));
const lastAddressAccount = computed<ContactWithIcon | null>(() => {
  if (!previousTransactionAddress.value) {
    return null;
  }
  const contact = userContacts.value.find((e) => e.address === previousTransactionAddress.value);
  if (contact) {
    return {
      ...contact,
      icon: ClockIcon,
    };
  } else {
    return {
      name: "Previous transaction address",
      address: previousTransactionAddress.value,
      icon: ClockIcon,
    };
  }
});

const displayedAddresses = computed<AddressesGroup[]>(() => {
  const groups: Record<string, AddressesGroup> = {
    default: {
      title: null,
      addresses: [],
    },
  };

  if (props.ownAddressDisplayed) {
    groups.default.addresses.push(ownAccount.value);
  }

  if (lastAddressAccount.value) {
    groups.default.addresses.push(lastAddressAccount.value);
  }

  for (const [contactsGroupCharacter, contactsGroup] of Object.entries(userContactsByFirstCharacter.value)) {
    groups[contactsGroupCharacter] = {
      title: contactsGroupCharacter,
      addresses: contactsGroup,
    };
  }

  const result = Object.values(groups);
  if (search.value.length) {
    const filtered = result
      .map((group) => {
        return {
          ...group,
          addresses: findContactsByText(group.addresses, search.value),
        };
      })
      .filter((group) => group.addresses.length);
    if (inputtedAddressAccount.value && filtered.length === 0) {
      return [
        {
          title: null,
          addresses: [inputtedAddressAccount.value],
        },
      ];
    }
    return filtered;
  }
  return result.filter((group) => group.addresses.length);
});
</script>

<style lang="scss" scoped>
.group-category-label:first-child {
  @apply pt-0;
}
</style>
