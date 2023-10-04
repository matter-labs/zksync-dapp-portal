<template>
  <div>
    <BackButton :fallback="{ name: 'index' }" />
    <h1 class="h1">Where to send</h1>

    <ModalTransactionWithdrawExchangeWarning
      :opened="openedModal === 'withdraw-to-exchange'"
      :button-location="{ name: 'transaction-zksync-lite-withdraw' }"
      :withdraw-to-self-link-location="{ name: 'transaction-zksync-era-withdraw', query: { address: account.address } }"
      @close="closeModal"
    />

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.zkSyncLite"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-lite-send', query: $route.query }"
        description="Send inside zkSync Lite network"
      />
      <DestinationItem
        v-if="zkSyncLiteNetwork.l1Network"
        v-bind="destinations.ethereum"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-lite-withdraw', query: $route.query }"
        :description="`Withdraw to ${destinations.ethereum.label}`"
      />
    </CommonCardWithLineButtons>

    <template v-if="zkSyncLiteNetwork.l1Network">
      <TypographyCategoryLabel>Send to exchange</TypographyCategoryLabel>
      <CommonCardWithLineButtons>
        <DestinationItem
          label="Official bridge"
          :icon-url="destinations.ethereum.iconUrl"
          description="Send to exchange using official bridge"
          @click="openedModal = 'withdraw-to-exchange'"
        />
      </CommonCardWithLineButtons>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";

const { destinations } = storeToRefs(useDestinationsStore());
const { account } = storeToRefs(useOnboardStore());
const { zkSyncLiteNetwork } = storeToRefs(useLiteProviderStore());

const openedModal = ref<"withdraw-to-exchange" | undefined>();
const closeModal = () => {
  openedModal.value = undefined;
};
</script>

<style lang="scss" scoped></style>
