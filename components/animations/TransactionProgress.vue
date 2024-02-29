<template>
  <div
    class="transaction-progress-animation"
    :class="{
      'transaction-completed': state === 'completed',
      'transaction-failed': state === 'failed',
      'stopped-in-the-end': state === 'stopped-in-the-end',
    }"
  >
    <div class="no-overflow-container">
      <div class="lines-inner">
        <div v-for="index in 40" :key="index" class="line"></div>
      </div>
      <svg class="airplane" aria-hidden="true" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22 12L1 1L2 9L6 12L2 15L1 23L22 12Z"
          class="airplane-path"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
      <div class="check-icon">
        <CheckIcon aria-hidden="true" />
      </div>
      <div class="fail-icon">
        <XMarkIcon aria-hidden="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";

export type AnimationState = "playing" | "stopped-in-the-end" | "failed" | "completed";

defineProps({
  state: {
    type: String as PropType<AnimationState>,
    default: "playing",
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.transaction-progress-animation {
  @apply relative isolate overflow-visible;
  &::before,
  &::after {
    @apply absolute top-1/2 z-[1] h-10 w-[25%] -translate-y-1/2 transform from-neutral-100 to-transparent dark:from-neutral-900 sm:w-[15%];
    content: "";
  }
  &::before {
    @apply -left-px bg-gradient-to-r transition;
  }
  &::after {
    @apply -right-px bg-gradient-to-l transition;
  }
  &.transaction-completed {
    .no-overflow-container {
      .lines-inner {
        animation-play-state: paused;
      }
      .airplane {
        @apply opacity-0;
      }
      .check-icon {
        animation: bounce-in 1s linear forwards;
      }
    }
  }
  &.transaction-failed {
    .no-overflow-container {
      .lines-inner {
        animation-play-state: paused;
      }
      .airplane {
        @apply opacity-0;
      }
      .fail-icon {
        animation: bounce-in 1s linear forwards;
      }
    }
  }
  &.stopped-in-the-end {
    &::after {
      @apply opacity-0;
    }
    .no-overflow-container {
      .airplane {
        animation: none;
        left: 100%;
        transform: translate(-100%, -50%);
      }
    }
  }

  .no-overflow-container {
    @apply relative h-20 w-full overflow-hidden;

    .lines-inner {
      @apply absolute top-1/2 grid h-0.5 w-[200%] grid-flow-col gap-x-[2%] sm:gap-x-[1%];
      animation: transaction-progress-lines 5s linear infinite;
      @keyframes transaction-progress-lines {
        0% {
          transform: translateX(-50%) translateY(-50%);
        }
        100% {
          transform: translateX(0%) translateY(-50%);
        }
      }

      .line {
        @apply h-full w-full rounded bg-neutral-600 dark:bg-neutral-700;
        @media screen and (max-width: 640px) {
          &:nth-child(n + 20) {
            @apply hidden;
          }
        }
      }
    }
    .airplane {
      @apply absolute top-1/2 h-7 w-7 transform transition-opacity;
      animation: plane-animation 2s ease-in-out infinite;
      @keyframes plane-animation {
        0% {
          left: 0;
          transform: translate(-100%, -50%);
        }
        100% {
          left: 100%;
          transform: translate(0%, -50%);
        }
      }

      .airplane-path {
        @apply fill-neutral-100 dark:fill-neutral-900;
      }
    }
    .check-icon {
      @apply absolute left-1/2 top-1/2 h-9 w-9 origin-top-left transform rounded-full bg-success-400 p-1 text-black opacity-0 transition-opacity;
      @keyframes bounce-in {
        0% {
          transform: scale(0) translate(-50%, -50%);
          animation-timing-function: ease-in;
          opacity: 0;
        }
        35% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
          opacity: 1;
        }
        55% {
          transform: scale(1.5) translate(-50%, -50%);
          animation-timing-function: ease-in;
        }
        70% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
        }
        80% {
          transform: scale(1.24) translate(-50%, -50%);
          animation-timing-function: ease-in;
        }
        90% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
        }
        95% {
          transform: scale(1.04) translate(-50%, -50%);
          animation-timing-function: ease-in;
        }
        100% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
          opacity: 1;
        }
      }
    }
    .fail-icon {
      @apply absolute left-1/2 top-1/2 h-9 w-9 origin-top-left transform rounded-full bg-red-400 p-1 text-black opacity-0 transition-opacity;
      @keyframes bounce-in {
        0% {
          transform: scale(0) translate(-50%, -50%);
          animation-timing-function: ease-in;
          opacity: 0;
        }
        35% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
          opacity: 1;
        }
        55% {
          transform: scale(1.5) translate(-50%, -50%);
          animation-timing-function: ease-in;
        }
        70% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
        }
        80% {
          transform: scale(1.24) translate(-50%, -50%);
          animation-timing-function: ease-in;
        }
        90% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
        }
        95% {
          transform: scale(1.04) translate(-50%, -50%);
          animation-timing-function: ease-in;
        }
        100% {
          transform: scale(1) translate(-50%, -50%);
          animation-timing-function: ease-out;
          opacity: 1;
        }
      }
    }
  }
}
</style>
