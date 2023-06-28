<template>
  <span class="hidden"></span>
</template>

<script lang="ts" setup>
import { watch } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "popupToggled", value: boolean): void;
}>();

watch(
  () => props.open,
  (value) => {
    emit("popupToggled", value);
  }
);
</script>
