<template>
  <div class="login-layout">
    <Header />
    <main class="login-layout-main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.login-layout {
  @apply relative flex flex-col;
  min-height: 100vh;
  min-height: 100dvh;

  .login-layout-main {
    @apply mx-auto my-auto flex w-11/12 max-w-[352px] flex-col px-4 py-2 md:px-0 md:py-4;
  }
}
</style>
