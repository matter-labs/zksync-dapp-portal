<template>
  <div>
    <CommonModal v-model:opened="accountModalOpened" title="">
      <div class="-mt-4 flex w-full flex-col items-center">
        <AddressAvatar :address="account.address" class="h-20 w-20" />
        <div class="mt-2 flex w-full flex-1 items-center justify-center">
          <div class="h1 overflow-hidden text-ellipsis whitespace-nowrap p-0 text-center">
            {{ shortenAddress(account.address!) }}
          </div>
          <button v-tooltip="copied ? 'Address copied' : 'Copy address'" class="copy-button" @click="copy">
            <DocumentDuplicateIcon v-if="!copied" class="copy-button-icon" aria-hidden="true" tabindex="-1" />
            <CheckIcon v-else class="copy-button-icon check-icon" aria-hidden="true" tabindex="-1" />
          </button>
        </div>
      </div>
      <CommonCardWithLineButtons class="mt-4">
        <CommonButtonLineWithImg @click="networkChangeModalOpened = true">
          <template #image>
            <IconsEra class="account-modal-icon" />
          </template>
          <template #default>
            <CommonButtonLineBodyInfo class="text-left">
              <template #label>{{ eraNetwork.name }} </template>
              <template #underline>Bridge network</template>
            </CommonButtonLineBodyInfo>
          </template>
          <template #right>
            <ChevronDownIcon class="mr-2 h-5 w-5" aria-hidden="true" />
          </template>
        </CommonButtonLineWithImg>
      </CommonCardWithLineButtons>
      <CommonButtonGroup class="mt-4">
        <CommonButton @click="viewOnExplorerModalOpened = true">
          <template #icon>
            <Squares2X2Icon aria-hidden="true" />
          </template>
          <template #default>View on Explorer</template>
        </CommonButton>
        <CommonButton @click="logout">
          <template #icon>
            <PowerIcon aria-hidden="true" />
          </template>
          <template #default>Logout</template>
        </CommonButton>
      </CommonButtonGroup>
    </CommonModal>
    <ModalNetworkChange v-model:opened="networkChangeModalOpened" :networks="['era']" />
    <ModalViewOnExplorer v-model:opened="viewOnExplorerModalOpened" />

    <button class="account-button" @click="accountModalOpened = true">
      <AddressAvatar v-if="!avatar" :address="account.address!" class="account-icon" />
      <img v-else :src="avatar" class="account-icon aspect-square rounded-full" />
      <div class="account-name-container">
        <span class="account-name">{{ name ? name : shortenAddress(account.address!) }}</span>
        <span class="network-name">{{ eraNetwork.shortName }}</span>
      </div>
      <ChevronDownIcon class="account-dropdown-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { CheckIcon, ChevronDownIcon, DocumentDuplicateIcon, Squares2X2Icon } from "@heroicons/vue/24/outline";
import { PowerIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";

import useCopy from "@/composables/useCopy";

import { useEnsStore } from "@/store/ens";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { shortenAddress } from "@/utils/formatters";

const onboardStore = useOnboardStore();
const { account } = storeToRefs(useOnboardStore());
const { name, avatar } = storeToRefs(useEnsStore());
const { eraNetwork } = storeToRefs(useEraProviderStore());

const accountModalOpened = ref(false);
const networkChangeModalOpened = ref(false);
const viewOnExplorerModalOpened = ref(false);

const accountAddress = computed(() => account.value.address || "");
const { copy, copied } = useCopy(accountAddress, 700);

const logout = () => {
  accountModalOpened.value = false;
  onboardStore.disconnect();
};
</script>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-3xl bg-transparent bg-gray py-1 px-2 transition-colors hover:bg-gray-200 dark:bg-neutral-900 dark:hover:bg-neutral-800;

  .account-icon {
    @apply -ml-1 aspect-square h-8 w-8;
  }
  .account-name-container {
    @apply -my-1 ml-2 flex flex-col justify-center whitespace-nowrap text-left leading-none;

    .account-name {
      @apply max-w-[7rem] overflow-hidden text-ellipsis text-sm tracking-[-0.1px];
    }
    .network-name {
      @apply text-xs text-gray-secondary dark:text-neutral-400;
    }
  }
  .account-dropdown-icon {
    @apply ml-2 h-5 w-5 text-gray-secondary dark:text-neutral-400;
  }
}
.account-modal-icon {
  @apply block h-full w-full p-1.5;
}
.copy-button {
  @apply ml-2 rounded p-1 ring-primary-400;

  .copy-button-icon {
    @apply pointer-events-none h-7 w-7 text-gray-secondary dark:text-neutral-300;
    &.check-icon {
      @apply text-primary-400;
    }
  }
}
</style>
