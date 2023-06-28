<template>
  <div class="navbar">
    <Popover class="popover-container" v-slot="{ open }">
      <PopoverFunctional :open="open" @popupToggled="handlePopupToggled" />
      <div
        class="panel-container-desktop"
        :class="{ 'bg-gray dark:bg-black lg:bg-transparent dark:lg:bg-transparent': open }"
      >
        <div class="logo-container">
          <a href="https://zksync.io" target="_blank">
            <IconsZkSync class="w-[120px]" />
          </a>
        </div>
        <div class="navigation-container">
          <PopoverGroup class="popover-group">
            <DropdownPopover on-hover>
              Learn
              <template #items>
                <DropdownContent :navigation="learnNav" label="Learn" />
              </template>
            </DropdownPopover>
            <DropdownPopover on-hover>
              Build
              <template #items>
                <DropdownContent :navigation="buildNav" label="Build" />
              </template>
            </DropdownPopover>
            <DropdownPopover on-hover>
              Network
              <template #items>
                <DropdownContent :navigation="networkNav" label="Network" />
              </template>
            </DropdownPopover>
          </PopoverGroup>
        </div>
        <div class="right-side-menu">
          <RightSideMenu />
        </div>
        <div class="popover-button left-border">
          <PopoverButton class="align-bottom focus-visible:outline-none" aria-label="Toggle menu">
            <Bars3Icon v-if="!open" class="menu-icon" />
            <XMarkIcon v-else class="menu-icon" />
          </PopoverButton>
        </div>
      </div>
      <PopoverPanel class="panel-container-mobile">
        <PopoverGroup class="popover-group">
          <DropdownContent :navigation="learnNav" label="Learn" />
          <DropdownContent :navigation="buildNav" label="Build" />
          <DropdownContent :navigation="networkNav" label="Network" />
        </PopoverGroup>
      </PopoverPanel>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

import DropdownContent from "./DropdownContent.vue";
import DropdownPopover from "./DropdownPopover.vue";
import PopoverFunctional from "./PopoverFunctional.vue";
import RightSideMenu from "./RightSideMenu.vue";

export interface Navigation {
  title?: string;
  items: {
    label: string;
    url: string;
  }[];
}

const emit = defineEmits<{
  (eventName: "update:popupOpened", value: boolean): void;
}>();
function handlePopupToggled(value: boolean) {
  emit("update:popupOpened", value);
}

const learnNav: Navigation[] = reactive([
  {
    title: "",
    items: [
      { label: "Freedom is our mission", url: "https://zksync.io/ethos" },
      { label: "Hyperscalibility", url: "https://zksync.io/hyperscalability" },
      { label: "Security", url: "https://zksync.io/security" },
      { label: "Game-changing UX", url: "https://zksync.io/ux" },
    ],
  },
]);

const buildNav: Navigation[] = reactive([
  {
    title: "",
    items: [
      { label: "Quickstart", url: "https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html" },
      { label: "Documentation", url: "https://era.zksync.io/docs/" },
      { label: "Web3 API", url: "https://era.zksync.io/docs/api/api.html" },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        label: "Contract deployment",
        url: "https://era.zksync.io/docs/dev/building-on-zksync/contracts/contract-deployment.html",
      },
      { label: "Bridging assets", url: "https://era.zksync.io/docs/dev/developer-guides/bridging/bridging-asset.html" },
      { label: "Account abstraction", url: "https://era.zksync.io/docs/dev/tutorials/custom-aa-tutorial.html" },
      {
        label: "Building custom Paymasters",
        url: "https://era.zksync.io/docs/dev/tutorials/custom-paymaster-tutorial.html",
      },
      { label: "Cross-chain governance", url: "https://era.zksync.io/docs/dev/tutorials/cross-chain-tutorial.html" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Javascript SDK", url: "https://era.zksync.io/docs/api/js" },
      { label: "Hardhat plugins", url: "https://era.zksync.io/docs/api/hardhat" },
      { label: "zkSync Era CLI", url: "https://era.zksync.io/docs/api/tools/zksync-cli/" },
    ],
  },
]);

const networkNav: Navigation[] = reactive([
  {
    title: "zkSync Era (v2)",
    items: [
      { label: "Intro to zkSync Era", url: "https://era.zksync.io/docs/dev/fundamentals/zkSync.html" },
      { label: "Wallet Portal", url: "https://portal.zksync.io/" },
      { label: "Block Explorer", url: "https://explorer.zksync.io/" },
    ],
  },
  {
    title: "zkSync Lite (v1)",
    items: [
      { label: "Intro to zkSync Lite", url: "https://docs.zksync.io/userdocs/intro/" },
      { label: "Wallet Portal", url: "https://lite.zksync.io/" },
      { label: "Block Explorer", url: "https://zkscan.io/" },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      { label: "Explore the Ecosystem", url: "https://ecosystem.zksync.io/" },
      {
        label: "Brand assets",
        url: "https://matterlabs.notion.site/zkSync-Brand-Resources-750bb7b1f3d14ebe9f539a86901c4a1c/",
      },
    ],
  },
]);
</script>
<style lang="scss">
.navbar {
  @apply z-50 h-[72px] lg:mb-3;
  grid-area: header / header / header / header;

  .popover-container {
    @apply h-full text-neutral-950 dark:text-white;
  }
  .panel-container-desktop {
    @apply relative z-20 mx-auto flex h-full items-center justify-between px-5;
    @media screen and (min-width: 720px) {
      @apply grid grid-cols-[216px_1fr_216px] px-6;
    }
    @media screen and (min-width: 1024px) {
      @apply px-9;
    }

    .logo-container {
      @apply font-semibold;
    }
    .navigation-container {
      @apply hidden h-full justify-self-center lg:flex;
      .popover-group {
        @apply flex;
      }
    }
    .right-side-menu {
      @apply hidden lg:block;
    }
    .popover-button {
      @apply z-10 -mr-4 p-4 focus:outline-none focus-visible:outline-none lg:hidden;
      .menu-icon {
        @apply w-6 focus:outline-none;
      }
    }
  }
  .panel-container-mobile {
    @apply absolute left-0 z-50 w-full bg-gray px-6 dark:bg-black lg:hidden;
    .menu-label {
      @apply pb-2 pt-8 first:pt-0;
    }
    .menu-section-container {
      @apply mb-8 flex-wrap justify-between border-b pb-8 dark:border-[#292B43] xs:justify-start sm:flex-nowrap sm:justify-between;
      .menu-section {
        @apply min-w-[100px] max-w-[6rem] xxs:min-w-[132px] xxs:max-w-[8.25rem] xs:min-w-[160px] xs:max-w-[11rem] sm:min-w-[27%] sm:max-w-[21rem];
      }
    }
    .were-hiring {
      @apply mb-8 border-b border-[#292B43] pb-8 font-extralight;
    }
    .v1-docs {
      @apply pb-10 font-extralight;
    }
  }
}
</style>
