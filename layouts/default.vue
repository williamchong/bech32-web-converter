<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang='ts'>
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Bech32 Wallet Address Prefix Web Converter',
        description: 'Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.',
        url: 'https://bech32.williamchong.cloud',
        image: 'https://bech32.williamchong.cloud/images/cover.png',
        applicationCategory: 'DeveloperApplication',
        author: {
          '@type': 'Person',
          name: 'William Chong',
          url: 'https://blog.williamchong.cloud'
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
      })
    }
  ]
})

useSeoMeta({
  title: 'Bech32 Wallet Address Prefix Web Converter',
  ogTitle: 'Bech32 Wallet Address Prefix Web Converter',
  description: 'Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.',
  ogDescription: 'Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.',
  ogImage: 'https://bech32.williamchong.cloud/images/cover.png',
  ogType: 'website',
  ogUrl: 'https://bech32.williamchong.cloud',
})
</script>
