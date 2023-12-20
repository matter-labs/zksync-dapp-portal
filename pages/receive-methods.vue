<template>
  <div>
    <PageTitle :fallback-route="{ name: 'index' }">Receive</PageTitle>

    <div class="space-y-4">
      <CommonCardWithLineButtons>
        <DestinationItem
          label="View address"
          :description="`Receive from another ${destinations.era.label} account`"
          as="RouterLink"
          :to="{ name: 'receive' }"
        >
          <template #image>
            <QrCodeIcon class="p-0.5" />
          </template>
        </DestinationItem>
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons>
        <DestinationItem
          v-if="eraNetwork.l1Network"
          label="Official bridge"
          :description="`Receive from your ${destinations.ethereum.label} account`"
          :icon-url="destinations.ethereum.iconUrl"
          as="RouterLink"
          :to="{ name: 'bridge', query: $route.query }"
        />
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons v-if="eraNetwork.displaySettings?.showPartnerLinks">
        <DestinationItem
          label="Top-up with cash"
          description="Buy tokens using a card or another method for fiat"
          as="a"
          href="https://zksync.dappradar.com/ecosystem?category-de=gateways"
          target="_blank"
          :icon="ArrowTopRightOnSquareIcon"
        >
          <template #image>
            <DestinationIconContainer>
              <BanknotesIcon aria-hidden="true" />
            </DestinationIconContainer>
          </template>
        </DestinationItem>
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons v-if="eraNetwork.displaySettings?.showPartnerLinks">
        <DestinationItem
          label="3rd party bridges"
          description="Bridge tokens from other networks"
          as="a"
          href="https://zksync.dappradar.com/ecosystem?category-de=bridges"
          target="_blank"
          :icon="ArrowTopRightOnSquareIcon"
        >
          <template #image>
            <DestinationIconContainer>
              <ArrowsUpDownIcon aria-hidden="true" />
            </DestinationIconContainer>
          </template>
        </DestinationItem>
      </CommonCardWithLineButtons>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowsUpDownIcon, ArrowTopRightOnSquareIcon, BanknotesIcon, QrCodeIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useZkSyncProviderStore } from "@/store/zksync/provider";

const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
</script>

<style lang="scss" scoped></style>
