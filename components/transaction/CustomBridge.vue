<template>
  <div>
    <CommonAlert variant="warning" size="sm" :icon="ExclamationTriangleIcon" class="mb-block-gap">
      <p>Bridging {{ customBridgeToken.symbol }} is not supported by zkSync Portal.</p>
    </CommonAlert>
    <TypographyCategoryLabel>
      Use 3rd party bridges or CEXs to bridge {{ customBridgeToken.symbol }} to
      {{ type === "deposit" ? eraNetwork.name : eraNetwork.l1Network?.name }}.
    </TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-for="(item, index) in displayedBridges"
        :key="index"
        :label="item.label"
        :icon-url="item.iconUrl"
        :href="item.href!"
        :icon="ArrowTopRightOnSquareIcon"
        as="a"
        target="_blank"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/vue/24/outline";

import { type CustomBridgeToken } from "@/data/customBridgeTokens";

const props = defineProps({
  customBridgeToken: {
    type: Object as PropType<CustomBridgeToken>,
    required: true,
  },
  type: {
    type: String as PropType<"deposit" | "withdraw">,
    required: true,
  },
});

const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
const displayedBridges = computed(() => {
  if (props.type === "deposit") {
    return props.customBridgeToken.bridges
      .map((e) => ({
        ...e,
        href: e.depositUrl,
      }))
      .filter((e) => e.href);
  }
  return props.customBridgeToken.bridges
    .map((e) => ({
      ...e,
      href: e.withdrawUrl,
    }))
    .filter((e) => e.href);
});
</script>
