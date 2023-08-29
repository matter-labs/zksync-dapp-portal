<template>
  <slot v-bind="{ timer, isTimerFinished }">
    <span class="font-mono">{{ timer }}</span>
  </slot>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  futureDate: {
    type: String,
    required: true,
  },
});
const emit = defineEmits<{
  (eventName: "finish"): void;
}>();

const timer = ref("");
const isTimerFinished = computed(() => timer.value === "00:00:00");
watch(
  isTimerFinished,
  (isFinished) => {
    if (isFinished) {
      emit("finish");
    }
  },
  { immediate: true }
);

let intervalId: ReturnType<typeof setInterval> | undefined = undefined;
const updateTimer = () => {
  const currentTime = new Date().getTime();
  const targetTime = new Date(props.futureDate).getTime();
  let diff = targetTime - currentTime;

  if (diff <= 0) {
    clearInterval(intervalId);
    timer.value = "00:00:00";
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timer.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

onBeforeMount(() => {
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>
