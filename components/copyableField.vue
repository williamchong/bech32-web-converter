<template>
  <div class="flex items-center gap-2 w-full">
    <code class="flex-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600 break-all">
      {{ value || '-' }}
    </code>
    <button
      v-if="value && isSupported"
      class="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      @click="onClickCopy"
    >
      <span v-if="!copied">{{ $t('copy.button') }}</span>
      <span v-else class="text-green-600">{{ $t('copy.copied') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
}>()


const { copy, copied, isSupported } = useClipboard({ source: props.value })
function onClickCopy() {
  copy(props.value)
  useTrackEvent('copy')
}
</script>