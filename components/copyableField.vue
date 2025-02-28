<template>
  <div class="flex items-center gap-2 w-full">
    <code class="flex-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600 break-all">
      {{ value || '-' }}
    </code>
    <button
      v-if="value && isSupported"
      :title="$t('copy.button')"
      :alt="$t('copy.button')"
      class="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
      @click="onClickCopy"
    >
      <Icon v-if="!copied" name="ph:copy" class="h-5 w-5" />
      <Icon v-else name="ph:check" class="h-5 w-5 text-green-600" />
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