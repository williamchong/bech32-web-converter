<template>
  <div class="flex items-center gap-2 w-full">
    <code class="flex-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300 break-all">
      {{ value || '-' }}
    </code>
    <UButton
      v-if="value"
      :icon="copied ? 'ph:check' : 'ph:copy'"
      :color="copied ? 'success' : 'neutral'"
      variant="outline"
      size="sm"
      :title="$t('copy.button')"
      @click="onClickCopy"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
}>()


const { copy, copied } = useClipboard({ source: () => props.value })
function onClickCopy() {
  copy(props.value)
  useTrackEvent('copy')
}
</script>
