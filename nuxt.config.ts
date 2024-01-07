import { portal as portalMeta } from "./data/meta";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/bridge",
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
          property: "og:image",
          content: portalMeta.previewImg.src,
        },
        {
          property: "og:image:alt",
          content: portalMeta.previewImg.alt,
        },
        {
          property: "og:image:type",
          content: "image/jpeg",
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
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
  modules: ["@kevinmarrec/nuxt-pwa", "@pinia/nuxt"],
  ssr: false,
  pwa: {
    meta: {
      name: portalMeta.title,
      description: portalMeta.description,
    },
    manifest: {
      name: portalMeta.title,
      short_name: "Portal",
    },
  },
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
      nodeType: process.env.NODE_TYPE as undefined | "memory" | "dockerized" | "hyperchain",
      ankrToken: process.env.ANKR_TOKEN,
      screeningApiUrl: process.env.SCREENING_API_URL,
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore` and `storeToRefs` typings
      "defineStore",
      "storeToRefs",
    ],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_mixins.scss" as *;',
        },
      },
    },
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
