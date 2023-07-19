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
          content: "https://portal.zksync.io/preview.jpg",
        },
        {
          property: "og:image:alt",
          content: "zkSync Portal",
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
  modules: ["@kevinmarrec/nuxt-pwa", "@pinia/nuxt"],
  ssr: false,
  pwa: {
    meta: {
      name: "zkSync Portal | Wallet, Bridge and Faucet",
      description:
        "zkSync Portal provides all the required tools for working with Era and Lite networks such as Wallet, Bridge & Faucet functionality.",
    },
    manifest: {
      name: "zkSync Portal | Wallet, Bridge and Faucet",
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
