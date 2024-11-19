// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Bech32 Wallet Address Prefix Web Converter',
      meta: [
        { name: 'og:title', content: 'Bech32 Wallet Address Prefix Web Converter' },
        { name: 'description', content: 'Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.' }
      ],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  experimental: {
    clientNodeCompat: true,
  },
})
