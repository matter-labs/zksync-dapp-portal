<template>
  <div>
    <PageTitle :fallback-route="{ name: 'index' }">Send</PageTitle>

    <ModalTransactionWithdrawExchangeWarning
      :opened="openedModal === 'withdraw-to-exchange'"
      :button-location="{ name: 'bridge-withdraw' }"
      :withdraw-to-self-link-location="{ name: 'bridge-withdraw', query: { address: account.address } }"
      @close="closeModal"
    />

    <div class="space-y-4">
      <CommonCardWithLineButtons>
        <DestinationItem
          v-bind="destinations.era"
          :label="`Send do another account on ${destinations.era.label}`"
          as="RouterLink"
          :to="{ name: 'send', query: $route.query }"
        />
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons>
        <DestinationItem
          v-if="eraNetwork.l1Network"
          v-bind="destinations.ethereum"
          :label="`Bridge to ${destinations.ethereum.label}`"
          as="RouterLink"
          :to="{ name: 'bridge-withdraw', query: $route.query }"
        />
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons>
        <DestinationItem
          v-if="eraNetwork.displaySettings?.showPartnerLinks"
          :label="`Bridge to other networks`"
          :description="`Explore ecosystem of third party bridges`"
          :icon="ArrowTopRightOnSquareIcon"
          as="a"
          href="https://zksync.dappradar.com/ecosystem?category-de=bridges"
          target="_blank"
        >
          <template #image>
            <div class="aspect-square h-full w-full rounded-full bg-gray-100 p-3 text-neutral-950 dark:bg-neutral-50">
              <Squares2X2Icon aria-hidden="true" />
            </div>
          </template>
        </DestinationItem>
      </CommonCardWithLineButtons>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { ArrowTopRightOnSquareIcon, Squares2X2Icon } from "@heroicons/vue/24/outline";
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
