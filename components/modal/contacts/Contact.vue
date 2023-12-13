<template>
  <CommonModal v-bind="$attrs" title="" @after-leave="confirmRemove = false">
    <template #animation v-if="contact">
      <div class="flex w-full flex-col items-center">
        <AddressAvatar :address="contact.address" class="h-20 w-20" />
        <div class="h1 mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap p-0 text-center">
          {{ contact.name }}
        </div>
      </div>
    </template>
    <template #default v-if="contact">
      <TypographyCategoryLabel>Information</TypographyCategoryLabel>
      <CommonInfoContent label="Address" :copy-content="contact.address">
        {{ shortenAddress(contact.address, 5) }}
      </CommonInfoContent>

      <TypographyCategoryLabel>Actions</TypographyCategoryLabel>
      <CommonButtonGroup>
        <CommonButton
          variant="primary"
          as="RouterLink"
          :to="{ name: 'transaction-send', query: { address: contact.address } }"
        >
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton variant="primary" @click="emit('edit')">
          <template #icon>
            <PencilIcon aria-hidden="true" />
          </template>
          <template #default>Edit</template>
        </CommonButton>
        <CommonButton variant="primary" @click="confirmRemove ? removeContact() : (confirmRemove = true)">
          <template #icon>
            <TrashIcon aria-hidden="true" />
          </template>
          <template #default>{{ !confirmRemove ? "Remove" : "Are you sure?" }}</template>
        </CommonButton>
      </CommonButtonGroup>
    </template>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { PaperAirplaneIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";

import type { Contact } from "@/store/contacts";
import type { PropType } from "vue";

import { shortenAddress } from "@/utils/formatters";

defineProps({
  contact: {
    type: Object as PropType<Contact | undefined>,
  },
});
const emit = defineEmits<{
  (eventName: "remove"): void;
  (eventName: "edit"): void;
}>();

const confirmRemove = ref(false);
const removeContact = () => {
  emit("remove");
};
</script>
