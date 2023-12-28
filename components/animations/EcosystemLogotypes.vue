<template>
  <div class="imgs-container">
    <img v-for="item in ecosystem" :key="item.name" :src="item.src" :alt="item.name" class="animated-logo" />
  </div>
</template>

<script lang="ts" setup>
const ecosystem = [
  { name: "Ramp", src: "/img/ecosystem/ramp.svg" },
  { name: "1inch", src: "/img/ecosystem/1inch.svg" },
  { name: "Gravity", src: "/img/ecosystem/gravity.svg" },
  { name: "LayerSwap", src: "/img/ecosystem/layerswap.svg" },
  { name: "Lido", src: "/img/ecosystem/lido.svg" },
  { name: "QuarkID", src: "/img/ecosystem/quarkid.svg" },
  { name: "Pudgy Penguins", src: "/img/ecosystem/pudgy_penguin.svg" },
  { name: "Clave", src: "/img/ecosystem/clave.svg" },
  { name: "Rocket Pool", src: "/img/ecosystem/rocket_pool.svg" },
  { name: "Uniswap", src: "/img/ecosystem/uniswap.svg" },
  { name: "Mase", src: "/img/ecosystem/mase.svg" },
];
</script>

<style lang="scss" scoped>
@use "sass:math";
.imgs-container {
  @apply relative -mx-block-padding-1/2 grid h-[64px] grid-cols-[repeat(11,1fr)] sm:-mx-block-padding;
}
.animated-logo {
  @apply absolute h-[64px] w-[64px] overflow-visible object-cover;
  $animation-duration: 20s;
  $number-of-elements: 11;
  animation: ecosystem-logos-animation $animation-duration ease-in-out infinite;
  @for $i from 1 through $number-of-elements {
    &:nth-child(#{$i + 1}) {
      $delay: math.div(-$i * $animation-duration, $number-of-elements);
      animation-delay: $delay;
    }
  }
  @keyframes ecosystem-logos-animation {
    0% {
      left: 0%;
      translate: 0;
    }
    0%,
    100% {
      opacity: 0;
      scale: 0.5;
    }
    40%,
    60% {
      opacity: 1;
    }
    50% {
      scale: 1;
    }
    100% {
      left: 100%;
      translate: -100%;
    }
  }
}
</style>
