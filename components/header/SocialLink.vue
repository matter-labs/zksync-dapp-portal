<template>
  <a
    class="social-link"
    :class="{ 'icon-only': iconOnly }"
    :href="socialInfo.url"
    :aria-label="socialInfo.label"
    target="_blank"
  >
    <component class="social-link-icon" :is="socialInfo.icon" />
    <div class="social-link-label">{{ socialInfo.label }}</div>
  </a>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import IconDiscord from "@/components/icons/Discord.vue";
import IconEmail from "@/components/icons/Email.vue";
import IconMirror from "@/components/icons/Mirror.vue";
import IconTelegram from "@/components/icons/Telegram.vue";
import IconTwitter from "@/components/icons/Twitter.vue";

import type { PropType } from "vue";

export type SocialType = "medium" | "discord" | "telegram" | "twitter" | "email";

const props = defineProps({
  variant: {
    type: String as PropType<SocialType>,
    required: true,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
});

const socialInfo = computed(() => {
  switch (props.variant) {
    case "medium":
      return {
        label: "Blog",
        url: "https://zksync.mirror.xyz/",
        icon: IconMirror,
      };
    case "discord":
      return {
        label: "Discord Community",
        url: "https://join.zksync.dev/",
        icon: IconDiscord,
      };
    case "telegram":
      return {
        label: "Telegram Support",
        url: "https://t.me/zksync",
        icon: IconTelegram,
      };
    case "twitter":
      return {
        label: "Twitter Community",
        url: "https://twitter.com/zksync",
        icon: IconTwitter,
      };
    case "email":
    default:
      return {
        label: "Email",
        url: "https://zksync.io/contact",
        icon: IconEmail,
      };
  }
});
</script>

<style lang="scss" scoped>
.social-link {
  @apply flex flex-col items-center;
  &.icon-only {
    .social-link-icon {
      @apply h-6 w-6;
    }
    .social-link-label {
      @apply md:hidden;
    }
  }

  .social-link-icon {
    @apply h-10 w-10;
  }

  .social-link-label {
    @apply mt-3 hidden max-w-[80px] text-center text-base md:block;
  }
}
</style>
