// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
      meta: [
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
      ],
      script: [
        {
          src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
        },
      ],
    },
  },
  plugins: [],
  modules: ["@pinia/nuxt"],
  ssr: false,
  css: ["@/assets/css/tailwind.css", "@/assets/css/style.scss", "web3-avatar-vue/dist/style.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      walletConnectProjectID: process.env.WALLET_CONNECT_PROJECT_ID,
      turnstileKey: process.env.TURNSTILE_KEY,
    },
  },
  vite: {
    build: {
      target: "es2020",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
  },
});
