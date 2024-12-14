import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Bech32 Wallet Address Prefix Web Converter",
      meta: [
        {
          name: "og:title",
          content: "Bech32 Wallet Address Prefix Web Converter",
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
  modules: ["nuxt-gtag", "@vueuse/nuxt"],
  gtag: {
    id: "G-J481P5HG5T",
  },
  plugins: ["~/plugins/node.client.ts"],
  alias: {
    "readable-stream": path.resolve(__dirname, "node_modules/readable-stream"),
    "process/": path.resolve(
      __dirname,
      "node_modules/unenv/runtime/node/process"
    ),
    events: path.resolve(__dirname, "node_modules/events"),
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  experimental: {
    clientNodeCompat: true,
  },
});
