<template>
  <Dialog as="template" :open="modalOpened">
    <DialogPanel class="mobile-navigation-container">
      <div class="mx-auto max-w-[600px]">
        <div class="navigation-header">
          <PageTitle :as="DialogTitle" class="navigation-title">{{ title }}</PageTitle>
          <CommonButton @click="close()">
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </CommonButton>
        </div>
        <div class="navigation-body">
          <slot />
        </div>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
}>();

const route = useRoute();
watch(
  () => route.name,
  () => {
    close();
  }
);

const openedTab = ref<"main" | "network">("main");
const modalOpened = computed({
  get: () => props.opened,
  set: (value) => emit("update:opened", value),
});
watch(
  () => props.opened,
  (value) => {
    if (!value) {
      openedTab.value = "main";
    }
  }
);
const close = () => {
  modalOpened.value = false;
};
</script>

<style scoped lang="scss">
.mobile-navigation-container {
  @apply fixed left-0 top-0 z-[60] w-full overflow-y-auto overflow-x-hidden bg-neutral-50 dark:bg-black;
  height: 100vh;
  height: 100dvh;

  .navigation-header {
    @apply sticky top-0 flex items-center justify-between bg-neutral-50/70 p-2 backdrop-blur dark:bg-black/70 sm:p-4;

    .navigation-title {
      @apply mb-0;
    }
  }
  .navigation-body {
    @apply p-2;
  }
}
</style>
