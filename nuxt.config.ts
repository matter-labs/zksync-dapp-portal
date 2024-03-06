import { portal as portalMeta } from "./data/meta";

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
        {
          hid: "Rudder-JS",
          src: "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js",
          defer: true,
        },
      ],
    },
  },
  plugins: [],
  modules: [
    "@kevinmarrec/nuxt-pwa",
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxtjs/eslint-module", // https://nuxt.com/modules/eslint
    "@nuxtjs/tailwindcss", // https://nuxt.com/modules/tailwindcss
  ],
  css: ["@/assets/css/tailwind.css", "@/assets/css/style.scss", "web3-avatar-vue/dist/style.css"],
  ssr: false,
  pinia: {
    storesDirs: ["./store/**"],
  },
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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      ankrToken: process.env.ANKR_TOKEN,
      screeningApiUrl: process.env.SCREENING_API_URL,
      dataplaneUrl: process.env.DATAPLANE_URL,
      rudderKey: process.env.RUDDER_KEY,
    },
  },
  vite: {
    define: {
      // make these env available even outside of the Nuxt context
      "process.env.NODE_TYPE": JSON.stringify(process.env.NODE_TYPE),
      "process.env.WALLET_CONNECT_PROJECT_ID": JSON.stringify(process.env.WALLET_CONNECT_PROJECT_ID),
    },
    css: {
      preprocessorOptions: {
        scss: {
          // eslint-disable-next-line quotes
          additionalData: '@use "@/assets/css/_mixins.scss" as *;',
        },
      },
    },
  },
  devtools: { enabled: true },
});
