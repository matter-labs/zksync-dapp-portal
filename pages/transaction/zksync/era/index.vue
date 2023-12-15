<template>
  <div>
    <PageTitle :fallback-route="{ name: 'index' }">Where to send</PageTitle>

    <ModalTransactionWithdrawExchangeWarning
      :opened="openedModal === 'withdraw-to-exchange'"
      :button-location="{ name: 'bridge-withdraw' }"
      :withdraw-to-self-link-location="{ name: 'bridge-withdraw', query: { address: account.address } }"
      @close="closeModal"
    />

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.era"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-send', query: $route.query }"
        :description="`Send inside ${destinations.era.label} network`"
      />
      <DestinationItem
        v-if="eraNetwork.l1Network"
        v-bind="destinations.ethereum"
        as="RouterLink"
        :to="{ name: 'bridge-withdraw', query: $route.query }"
        :description="`Withdraw to ${destinations.ethereum.label}`"
      />
    </CommonCardWithLineButtons>

    <template v-if="eraNetwork.displaySettings?.showPartnerLinks">
      <TypographyCategoryLabel>Send to exchange</TypographyCategoryLabel>
      <CommonCardWithLineButtons>
        <DestinationItem
          label="Official bridge"
          :icon-url="destinations.ethereum.iconUrl"
          description="Send to exchange using official bridge"
          @click="openedModal = 'withdraw-to-exchange'"
        />
        <DestinationItem
          v-bind="destinations.layerswap"
          :icon="ArrowUpRightIcon"
          as="a"
          target="_blank"
          href="https://www.layerswap.io/?sourceExchangeName=ZKSYNCERA_MAINNET"
        />
      </CommonCardWithLineButtons>

      <TypographyCategoryLabel>Send to another network</TypographyCategoryLabel>
      <CommonCardWithLineButtons>
        <DestinationItem
          v-bind="destinations.layerswap"
          :icon="ArrowUpRightIcon"
          as="a"
          target="_blank"
          href="https://www.layerswap.io/?sourceExchangeName=ZKSYNCERA_MAINNET"
        />
        <DestinationItem
          v-bind="destinations.rhino"
          :icon="ArrowUpRightIcon"
          as="a"
          target="_blank"
          href="https://app.rhino.fi/bridge?chainOut=ETHEREUM&chain=ZKSYNC&token=ETH"
        />
      </CommonCardWithLineButtons>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";

const { destinations } = storeToRefs(useDestinationsStore());
const { account } = storeToRefs(useOnboardStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());

const openedModal = ref<"withdraw-to-exchange" | undefined>();
const closeModal = () => {
  openedModal.value = undefined;
};
</script>

<style lang="scss" scoped></style>
