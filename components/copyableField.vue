<template>
  <div>
    <code>
      {{ value || '-' }}
    </code>
    <button v-if="value && isSupported" @click="onClickCopy">
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
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
}
</script>