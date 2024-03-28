<template>
  <TransitionRoot as="template" :show="isModalOpened" @after-leave="afterLeave">
    <Dialog as="div" class="modal-container" @close="closeOnBackgroundClick">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="modal-background" />
      </TransitionChild>

      <div class="modal-card-y-container">
        <div class="modal-card-container">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              ref="modal"
              class="modal-card"
              aria-hidden="true"
              aria-modal="true"
              role="dialog"
              tabindex="-1"
              @trigger="closeOnBackgroundClick"
              @keydown.esc="closeOnBackgroundClick"
            >
              <div class="modal-header" :class="{ 'mb-4': title }">
                <DialogTitle v-if="title" as="div" class="modal-title">{{ title }}</DialogTitle>
                <button v-if="closable" data-testid="close-button" @click="closeModal">
                  <XMarkIcon class="modal-close-icon" aria-hidden="true" />
                </button>
              </div>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  title: {
    type: String,
  },
  opened: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  closeOnBackgroundClick: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (eventName: "close"): void;
  (eventName: "update:opened", value: boolean): void;
  (eventName: "after-leave", value: boolean): void;
}>();

const isModalOpened = computed({
  get: () => props.opened,
  set: (value) => {
    if (!value) {
      emit("close");
    }
    emit("update:opened", value);
  },
});
const closeOnBackgroundClick = () => {
  if (props.closeOnBackgroundClick) {
    closeModal();
  }
};
const closeModal = () => {
  if (!props.closable) {
    return;
  }
  isModalOpened.value = false;
};
const afterLeave = () => {
  emit("after-leave", false);
};
</script>

<style lang="scss">
.modal-container {
  // can not apply styles to this block in scoped style
  @apply relative z-[60];
}
</style>

<style lang="scss" scoped>
.modal-container {
  .modal-background {
    @apply fixed inset-0 bg-black bg-opacity-70 transition-opacity;
  }
  .modal-card-y-container {
    @apply fixed inset-0 z-10 overflow-y-auto;
  }
  .modal-card-container {
    @apply flex h-full items-end justify-center text-center sm:items-center sm:p-[72px];

    .modal-card {
      @apply relative max-h-[600px] w-full max-w-[600px] transform overflow-hidden rounded-3xl rounded-b-none bg-neutral-50 p-block-padding-1/2 text-left shadow-xl transition-all dark:bg-neutral-900 sm:rounded-b-3xl sm:p-block-padding;
      @media screen and (max-height: 640px) {
        max-height: calc(100vh - 96px);
        max-height: calc(100dvh - 96px);
      }
      .modal-header {
        @apply flex items-center justify-between;

        .modal-title {
          @apply text-2xl;
        }
        .modal-close-icon {
          @apply h-6 w-6 text-neutral-700 dark:text-white;
        }
      }
    }
  }
}
</style>
