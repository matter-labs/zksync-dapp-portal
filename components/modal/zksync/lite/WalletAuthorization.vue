<template>
  <CommonModal v-bind="$attrs" title="Wallet authorization">
    <div>
      <p class="leading-normal">
        Wallet authorization is a security procedure of re-generating your zkSync Lite private key. This is necessary to
        perform transactions on zkSync Lite network. You will only need to do this once per session or if you switch to
        a different wallet or account. This process <span class="font-medium">does not</span> involve deducting any
        funds from your account.
      </p>
      <div class="-mx-1 -mb-1 mt-4 xs:-mx-3 xs:-mb-3.5">
        <CommonAlert variant="neutral" :icon="InformationCircleIcon">
          Remember, it is good practice to read the messages you sign
        </CommonAlert>
      </div>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
</script>
