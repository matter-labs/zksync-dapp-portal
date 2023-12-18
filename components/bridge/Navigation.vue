<template>
  <CommonTabs :modelValue="activeTab" :options="tabs" class="mb-4">
    <template #tab="{ item }: { item: NavigationTab }">
      <NuxtLink class="block h-full w-full" :to="{ name: item.routeName }" replace>{{ item.label }}</NuxtLink>
    </template>
  </CommonTabs>
</template>

<script lang="ts">
type NavigationTab = TabsOption & { routeName: string };
export const tabs: NavigationTab[] = [
  {
    label: "Deposit",
    key: "deposit",
    routeName: "bridge",
  },
  {
    label: "Withdraw",
    key: "withdraw",
    routeName: "bridge-withdraw",
  },
];
</script>

<script lang="ts" setup>
import { computed } from "vue";

import type { TabsOption } from "@/components/common/Tabs.vue";

import { useRoute } from "#app";

const route = useRoute();

const activeTab = computed(() => tabs.find((tab) => tab.routeName === route.name)?.key);
</script>
