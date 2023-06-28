<template>
  <div class="header-dropdown-content">
    <p class="menu-label">{{ label }}</p>
    <div class="menu-section-container">
      <div v-for="section in navigation" :key="section.title" class="menu-section">
        <p v-if="section.title" class="section-title">{{ section.title }}</p>
        <div v-else class="pt-12"></div>
        <div v-for="item in section.items" :key="item.url" class="menu-link-container">
          <a :href="item.url" target="_blank" class="menu-link" :class="{ docs: item.label === 'zkSync Lite Docs' }">{{
            item.label
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Navigation } from "./Header.vue";
import type { PropType } from "vue";

defineProps({
  label: {
    type: String,
    required: true,
  },
  navigation: {
    type: Array as PropType<Navigation[]>,
    required: true,
  },
});
</script>

<style lang="scss">
.header-dropdown-content {
  .menu-label {
    @apply text-2xl;
  }
  .menu-section-container {
    @apply flex gap-x-0 p-0 xs:gap-x-20;
    .menu-section {
      @apply max-w-[21rem];
      .section-title {
        @apply whitespace-pre-wrap py-4 text-xs font-bold uppercase opacity-30;
      }
      .menu-link-container {
        @apply pb-4 last:pb-1;
        .menu-link {
          @apply font-extralight;
        }
        .docs {
          @apply opacity-50;
        }
      }
    }
  }
}
</style>
