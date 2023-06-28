<template>
  <div class="menu-container">
    <SocialLink v-for="item in menuItems" :key="item" :variant="item" icon-only />
  </div>
</template>

<script lang="ts" setup>
import SocialLink from "./SocialLink.vue";

import type { SocialType } from "./SocialLink.vue";

const menuItems: SocialType[] = ["medium", "discord", "telegram", "twitter", "email"];
</script>

<style lang="scss" scoped>
.menu-container {
  @apply flex gap-x-6;
  a {
    @apply flex;
  }
}
</style>
