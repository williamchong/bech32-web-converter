<template>
  <button
    :class="{
      'text-green-600 dark:text-green-400': isCopied,
      'text-blue-600 dark:text-blue-400': !isCopied
    }"
    class="hover:underline"
    @click="$emit('copy')"
  >
    {{ isCopied ? '✓ ' : '' }}{{ truncateAddress(value) }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  value: string
  index: number
  field: string
  isCopied: boolean
}

defineProps<Props>()
defineEmits<{
  copy: []
}>()

function truncateAddress(addr: string, maxLength: number = 12): string {
  if (addr.length <= maxLength) return addr
  return addr.slice(0, 6) + '...' + addr.slice(-6)
}
</script>
