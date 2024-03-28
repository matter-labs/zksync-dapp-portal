<template>
  <div>
    <PageTitle :fallback-route="{ name: 'assets' }">Balances</PageTitle>

    <template v-if="!isConnected">
      <ConnectWalletBlock>Connect wallet to view your assets on {{ eraNetwork.name }}</ConnectWalletBlock>
    </template>
    <template v-else>
      <CommonCardWithLineButtons v-if="loading">
        <TokenBalanceLoader v-for="index in 2" :key="index" send-route-name />
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons v-else-if="balanceError">
        <CommonErrorBlock @try-again="fetch">
          {{ balanceError.message }}
        </CommonErrorBlock>
      </CommonCardWithLineButtons>
      <div v-else>
        <div v-for="(group, index) in balanceGroups" :key="index">
          <TypographyCategoryLabel v-if="group.title">
            {{ group.title }}
          </TypographyCategoryLabel>
          <CommonCardWithLineButtons>
            <TokenBalance
              v-for="item in group.balances"
              :key="item.address"
              as="div"
              :send-route-name="
                item.amount === '0' ? 'receive-methods' : eraNetwork.l1Network ? 'send-methods' : 'send'
              "
              v-bind="item"
            />
          </CommonCardWithLineButtons>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const onboardStore = useOnboardStore();
const walletEraStore = useZkSyncWalletStore();
const { isConnected } = storeToRefs(onboardStore);
const { balance, balanceInProgress, balanceError } = storeToRefs(walletEraStore);
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());

const { loading, reset: resetSingleLoading } = useSingleLoading(computed(() => balanceInProgress.value));

const balanceGroups = groupBalancesByAmount(balance);

const fetch = () => {
  walletEraStore.requestBalance();
};
fetch();

const { reset: resetAutoUpdate, stop: stopAutoUpdate } = useInterval(() => {
  fetch();
}, 60000);

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  resetSingleLoading();
  resetAutoUpdate();
  fetch();
});

onBeforeUnmount(() => {
  stopAutoUpdate();
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
