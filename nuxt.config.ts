import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Bech32 Wallet Address Prefix Converter",
      meta: [
        {
          name: "og:title",
          content: "Bech32 Wallet Address Prefix Converter",
        },
        {
          name: "description",
          content:
            "Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.",
        },
      ],
      link: [
        {
          rel: "preload",
          href: "https://www.googletagmanager.com/gtag/js?id=G-J481P5HG5T",
          as: "script",
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  modules: [
    "nuxt-gtag",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxtjs/sitemap",
    "@nuxt/icon",
    "@sentry/nuxt/module",
  ],

  gtag: {
    id: "G-J481P5HG5T",
  },

  plugins: ["~/plugins/node.client.ts"],

  i18n: {
    baseUrl: 'https://bech32.williamchong.cloud',
    strategy: 'prefix_and_default',
    detectBrowserLanguage: {
      useCookie: false,
      redirectOn: 'root'
    },
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json'
      },
      {
        code: 'zh',
        language: 'zh-TW',
        file: 'zh.json'
      },
      {
        code: 'ja',
        language: 'ja-JP',
        file: 'ja.json'
      }
    ],
    lazy: true,
    defaultLocale: 'en',
  },

  site: {
    url: 'https://bech32.williamchong.cloud',
    name: 'Bech32 Wallet Address Prefix Converter',
  },

  alias: {
    "readable-stream": path.resolve(__dirname, "node_modules/readable-stream"),
    "process/": path.resolve(
      __dirname,
      "node_modules/unenv/dist/runtime/node/process"
    ),
    "string_decoder/": path.resolve(
      __dirname,
      "node_modules/unenv/dist/runtime/node/string_decoder"
    ),
    "node:events": path.resolve(__dirname, "node_modules/events"),
    "node:tty": path.resolve(__dirname, "node_modules/unenv/dist/runtime/node/tty"),
    events: path.resolve(__dirname, "node_modules/events"),
  },

  compatibilityDate: '2025-02-13',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages"
  },

  experimental: {
    clientNodeCompat: true,
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: "williamchong",
      project: "bech32-convertor",
    },
  },

  vite: {
    define: {
      __SENTRY_DEBUG__: false,
      __SENTRY_TRACING__: false,
    },
  },

  sourcemap: {
    client: "hidden",
  },
});