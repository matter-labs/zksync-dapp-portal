<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="h1 p-0">Bridge</h1>

      <CommonButton v-if="!account.address" class="-my-1" variant="primary" @click="onboardStore.openModal">
        Connect wallet
      </CommonButton>
      <BridgeAccountButton v-else />
    </div>
    <CommonTabs :modelValue="activeTab" :options="tabs" class="my-4" @update:modelValue="tabClicked" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import type { TabsOption } from "@/components/common/Tabs.vue";

import { useRoute, useRouter } from "#app";
import { useOnboardStore } from "@/store/onboard";

const route = useRoute();
const router = useRouter();

const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);

const tabs: (TabsOption & { routeName: string })[] = [
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

const activeTab = computed(() => tabs.find((tab) => tab.routeName === route.name)?.key);
const tabClicked = (tabKey: string) => {
  const tabRouteName = tabs.find((tab) => tab.key === tabKey)?.routeName;
  if (tabRouteName) {
    router.replace({ name: tabRouteName, query: route.query });
  }
};
</script>
