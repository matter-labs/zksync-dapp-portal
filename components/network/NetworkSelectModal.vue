<template>
  <CommonModal v-model:opened="isModalOpened" class="network-select-modal" :title="title" @after-leave="search = ''">
    <Combobox v-model="selectedNetworkKey">
      <!-- Temporarily hidden -->
      <!-- <CommonInputSearch
        v-model.trim="search"
        class="mb-block-padding-1/4"
        placeholder="Network name"
        autofocus="desktop"
      >
        <template #icon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </template>
      </CommonInputSearch> -->
      <div>
        <div v-for="(group, groupIndex) in displayedGroups" :key="groupIndex" class="category">
          <!-- <TypographyCategoryLabel size="sm" variant="darker" class="group-category-label">
            {{ group.title }}
          </TypographyCategoryLabel> -->
          <CommonLineButtonsGroup :margin-y="false" :gap="false">
            <DestinationItem
              v-for="(item, itemIndex) in group.destinations"
              v-bind="item"
              :key="itemIndex"
              :icon="item.key === selectedNetworkKey ? CheckIcon : undefined"
              variant="light"
              @click="selectedNetworkKey = item.key!"
            />
          </CommonLineButtonsGroup>
        </div>
        <p v-if="search && !displayedGroups.length" class="mt-block-padding-1/2 text-center">
          No chains found for "{{ search }}"
        </p>
        <slot name="body-bottom" />
      </div>
    </Combobox>
  </CommonModal>
</template>

<script lang="ts" setup>
import { Combobox } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  title: {
    type: String,
    default: "Choose network",
  },
  opened: {
    type: Boolean,
    default: false,
  },
  networkKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "update:networkKey", networkKey?: string): void;
}>();

const { destinations } = storeToRefs(useDestinationsStore());

const search = ref("");
const filterDestinations = (networks: TransactionDestination[]) => {
  const lowercaseSearch = search.value.toLowerCase();
  return networks.filter(({ label }) =>
    Object.values({ label })
      .filter((e) => typeof e === "string")
      .some((value) => value.toLowerCase().includes(lowercaseSearch))
  );
};
const destinationGroups = computed(() => [
  {
    title: "Chains",
    destinations: [destinations.value.era, destinations.value.ethereum],
  },
]);
const displayedGroups = computed(() =>
  destinationGroups.value
    .map((e) => ({
      title: e.title,
      destinations: filterDestinations(e.destinations),
    }))
    .filter((e) => e.destinations.length)
);

const selectedNetworkKey = computed({
  get: () => props.networkKey,
  set: (value) => {
    closeModal();
    emit("update:networkKey", value);
  },
});

const isModalOpened = computed({
  get: () => props.opened,
  set: (value) => emit("update:opened", value),
});
const closeModal = () => {
  isModalOpened.value = false;
};
</script>

<style lang="scss">
.network-select-modal {
  .modal-card {
    @apply grid h-full grid-rows-[max-content_max-content_1fr];
  }
  .category:first-child .group-category-label {
    @apply mt-block-padding-1/2;
  }
}
</style>
