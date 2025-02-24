<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang='ts'>
const { t } = useI18n()
const i18nHead = useLocaleHead()

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t('title'),
        description: t('description'),
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
  title: t('title'),
  ogTitle: t('title'),
  description: t('description'),
  ogDescription: t('description'),
  ogImage: 'https://bech32.williamchong.cloud/images/cover.png',
  ogType: 'website',
  ogUrl: 'https://bech32.williamchong.cloud',
})
</script>
