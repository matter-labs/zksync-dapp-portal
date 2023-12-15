<template>
  <div>
    <PageTitle>Bridge</PageTitle>
    <div class="flex items-center justify-between">
      <CommonButton v-if="!account.address" class="-my-1" variant="primary" @click="onboardStore.openModal">
        Connect wallet
      </CommonButton>
      <BridgeAccountButton v-else />
    </div>
    <CommonTabs :modelValue="activeTab" :options="tabs" class="my-4">
      <template #tab="{ item }: { item: NavigationTab }">
        <NuxtLink class="block h-full w-full" :to="{ name: item.routeName }" replace>{{ item.label }}</NuxtLink>
      </template>
    </CommonTabs>
  </div>
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

import { storeToRefs } from "pinia";

import type { TabsOption } from "@/components/common/Tabs.vue";

import { useRoute } from "#app";
import { useOnboardStore } from "@/store/onboard";

const route = useRoute();

const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);

const activeTab = computed(() => tabs.find((tab) => tab.routeName === route.name)?.key);
</script>
