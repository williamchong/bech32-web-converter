<template>
  <button
    :title="$t(`colorMode.${colorMode.preference}`)"
    :alt="$t(`colorMode.${colorMode.preference}`)"
    class="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200"
    @click="toggleColorMode"
  >
    <Icon
      v-if="colorMode.preference === 'light'"
      name="heroicons:sun"
      class="w-6 h-6 text-yellow-500"
    />
    <Icon
      v-else-if="colorMode.preference === 'dark'"
      name="heroicons:moon"
      class="w-6 h-6 text-indigo-400"
    />
    <Icon
      v-else
      name="heroicons:computer-desktop"
      class="w-6 h-6 text-gray-600 dark:text-gray-300"
    />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  const modes = ['light', 'dark', 'system'] as const
  const currentIndex = modes.indexOf(colorMode.preference as typeof modes[number])
  const nextIndex = (currentIndex + 1) % modes.length
  colorMode.preference = modes[nextIndex]
}
</script>
