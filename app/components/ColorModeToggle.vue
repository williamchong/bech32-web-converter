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

const modes = ['light', 'dark', 'system'] as const
const { state: currentMode, next: cycleNext } = useCycleList([...modes], {
  initialValue: colorMode.preference as typeof modes[number],
})

function toggleColorMode() {
  cycleNext()
  colorMode.preference = currentMode.value
}

const colorModeIcon = computed(() => {
  switch (colorMode.preference) {
    case 'light': return 'heroicons:sun'
    case 'dark': return 'heroicons:moon'
    default: return 'heroicons:computer-desktop'
  }
})
</script>
