// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Bech32 Wallet Address Prefix Web Converter',
      meta: [
        { name: 'og:title', content: 'Bech32 Wallet Address Prefix Web Converter' },
        { name: 'description', content: 'Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.' }
      ],
      link: [
        { rel: 'preload', href: 'https://cdn.jsdelivr.net/npm/keccak256@latest/keccak256.js', as: 'script' },
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/keccak256@latest/keccak256.js', body: true },
      ],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  experimental: {
    clientNodeCompat: true,
  },
})
