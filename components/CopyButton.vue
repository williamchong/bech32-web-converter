<template>
  <button
    :class="{
      'text-green-600 dark:text-green-400': isCopied,
      'text-blue-600 dark:text-blue-400': !isCopied
    }"
    class="hover:underline block w-full text-left overflow-hidden text-ellipsis whitespace-nowrap"
    :title="value"
    @click="$emit('copy')"
  >
    {{ isCopied ? '✓ ' : '' }}{{ value }}
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
</script>
