<template>
  <CommonModal
    v-model:opened="isModalOpened"
    :title="contactPreset ? 'Edit contact' : 'Add contact'"
    @after-leave="clearFields"
  >
    <form @submit.prevent="addContact">
      <CommonInput
        v-model="name"
        autofocus
        placeholder="Name of the contact"
        :error="v$.name.$error ? v$.name.$errors[0] && v$.name.$errors[0].$message.toString() : undefined"
        @keydown.enter="addContact"
      />
      <CommonInput
        v-model="address"
        placeholder="Ethereum address"
        class="mt-2"
        :error="v$.address.$error ? v$.address.$errors[0] && v$.address.$errors[0].$message.toString() : undefined"
        @keydown.enter="addContact"
      />
      <div v-if="error">
        <CommonErrorBlock :retry-button="false" class="mt-3">
          {{ error }}
        </CommonErrorBlock>
      </div>
      <CommonButton type="submit" variant="primary" class="mt-5 w-full">Save contact</CommonButton>
    </form>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { isAddress } from "ethers/lib/utils";

import type { Contact } from "@/store/contacts";
import type { PropType } from "vue";

import { checksumAddress } from "@/utils/formatters";

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  contactPreset: {
    type: Object as PropType<Contact>,
  },
  error: {
    type: String,
  },
});
const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "update:contactPreset", value?: Contact): void;
  (eventName: "update:error", value: string): void;
  (eventName: "addContact", contact: Contact): void;
}>();

const name = ref(props.contactPreset?.name || "");
const address = ref(props.contactPreset?.address || "");

const isModalOpened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});
watch(isModalOpened, (opened) => {
  if (opened && props.contactPreset) {
    name.value = props.contactPreset.name;
    address.value = props.contactPreset.address;
  }
});

const v$ = useVuelidate(
  {
    name: {
      required,
    },
    address: {
      required,
      isAddress: helpers.withMessage("Valid 0x Ethereum address required", (value: string) => {
        try {
          return isAddress(value);
        } catch (e) {
          return false;
        }
      }),
    },
  },
  { name, address },
  { $stopPropagation: true }
);
const addContact = async () => {
  emit("update:error", "");
  const validationResult = await v$.value.$validate();
  if (!validationResult) {
    return;
  }

  emit("addContact", {
    name: name.value,
    address: checksumAddress(address.value),
  });
};
const clearFields = () => {
  emit("update:error", "");
  emit("update:contactPreset", undefined);
  name.value = "";
  address.value = "";
  v$.value.$reset();
};
</script>
