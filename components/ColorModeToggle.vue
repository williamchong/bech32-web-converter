<template>
  <UButton
    :icon="colorModeIcon"
    variant="ghost"
    color="neutral"
    size="lg"
    :title="$t(`colorMode.${colorMode.preference}`)"
    class="fixed top-4 right-4 z-50"
    @click="toggleColorMode"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const colorModeIcon = computed(() => {
  switch (colorMode.preference) {
    case 'light': return 'heroicons:sun'
    case 'dark': return 'heroicons:moon'
    default: return 'heroicons:computer-desktop'
  }
})

function toggleColorMode() {
  const modes = ['light', 'dark', 'system'] as const
  const currentIndex = modes.indexOf(colorMode.preference as typeof modes[number])
  const nextIndex = (currentIndex + 1) % modes.length
  colorMode.preference = modes[nextIndex]
}
</script>
