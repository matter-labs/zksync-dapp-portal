<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="h1 p-0">Bridge</h1>
      <CommonButton class="mt-0.5" variant="primary" @click="onboardStore.openModal">
        <!-- <template #icon>
          <WalletIcon aria-hidden="true" />
        </template> -->
        <template #default>Connect wallet</template>
      </CommonButton>
    </div>
    <CommonTabs :modelValue="activeTab" :options="tabs" class="mt-3 mb-4" @update:modelValue="tabClicked" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import type { TabsOption } from "@/components/common/Tabs.vue";

import { useRoute, useRouter } from "#app";
import { useOnboardStore } from "@/store/onboard";

const route = useRoute();
const router = useRouter();

const onboardStore = useOnboardStore();

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
