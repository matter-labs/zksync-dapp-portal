<template>
  <div class="imgs-container">
    <img src="/img/ecosystem/ramp.svg" alt="Ramp" class="animated-logo" />
    <img src="/img/ecosystem/1inch.svg" alt="1inch" class="animated-logo" />
    <img src="/img/ecosystem/gravity.svg" alt="Gravity" class="animated-logo" />
    <img src="/img/ecosystem/layerswap.svg" alt="QuarkID" class="animated-logo" />
    <img src="/img/ecosystem/lido.svg" alt="Lido" class="animated-logo" />
    <img src="/img/ecosystem/quarkid.svg" alt="QuarkID" class="animated-logo" />
    <img src="/img/ecosystem/pudgy_penguin.svg" alt="Pudgy Penguins" class="animated-logo" />
    <img src="/img/ecosystem/clave.svg" alt="Clave" class="animated-logo" />
    <img src="/img/ecosystem/rocket_pool.svg" alt="Rocket Pool" class="animated-logo" />
    <img src="/img/ecosystem/uniswap.svg" alt="Uniswap" class="animated-logo" />
    <img src="/img/ecosystem/mase.svg" alt="Mase" class="animated-logo" />
  </div>
</template>

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
