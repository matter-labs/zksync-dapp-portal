<template>
  <div class="radial-progress" :class="{ loading: !active }" data-progress="100">
    <div v-if="active" class="circle">
      <div class="mask full">
        <div class="fill"></div>
      </div>
      <div class="mask half">
        <div class="fill"></div>
      </div>
    </div>
    <div class="inset flex p-[2px]">
      <div class="h-full w-full rounded-full bg-gray-input dark:bg-neutral-900"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  duration: {
    type: Number,
    default: 10000,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (eventName: "finished"): void;
}>();

let interval: ReturnType<typeof setInterval> | undefined;
watchEffect(() => {
  if (props.active) {
    interval = setInterval(() => {
      emit("finished");
    }, props.duration);
  } else {
    clearInterval(interval);
  }
});

const animationDuration = computed(() => `${props.duration}ms`);

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style lang="scss" scoped>
@use "sass:math";
.radial-progress {
  $circle-size: 20px;
  $inset-size: 14px;

  @apply relative rounded-full transition-colors duration-300;
  width: $circle-size;
  height: $circle-size;

  &.loading {
    @apply animate-pulse;
  }

  .circle {
    .mask {
      clip: rect(0px, $circle-size, $circle-size, math.div($circle-size, 2));

      &,
      .fill {
        width: $circle-size;
        height: $circle-size;
        backface-visibility: hidden;
        @apply absolute rounded-full;
      }
      &.full,
      .fill {
        animation: animateCircle linear 0s infinite;
        animation-duration: v-bind(animationDuration);
      }
      .fill {
        clip: rect(0px, math.div($circle-size, 2), $circle-size, 0px);
        @apply bg-primary-400;
      }
    }
  }
  .inset {
    @apply absolute left-1/2 top-1/2 aspect-square w-9/12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray dark:bg-neutral-900;
  }

  @keyframes animateCircle {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(180deg);
    }
  }
}
</style>
