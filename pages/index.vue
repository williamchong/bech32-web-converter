<template>
  <div class="min-h-screen bg-(--ui-bg) py-8">
    <ClientOnly><ColorModeToggle /></ClientOnly>
    <UContainer class="max-w-3xl space-y-8">
      <!-- Header -->
      <section class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          {{ $t('description') }}
        </p>
      </section>

      <UCard :ui="{ body: 'space-y-6' }">
        <!-- Input Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('input.title') }}</h2>
          <UTextarea
            ref="textareaRef"
            v-model="inputAddress"
            placeholder="cosmos1..../0xabcd....&#10;cosmos1..../0xabcd...."
            :rows="6"
            class="w-full"
            @click.once="onInputAddress"
          />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ $t('input.hint') }}</p>
          <div class="mt-4 flex gap-4">
            <UButton v-if="hasKeplr" :label="$t('input.buttons.keplr')" @click="getKeplrCosmosAddress" />
            <UButton v-if="hasEvmWallet" :label="$t('input.buttons.evm')" @click="getEvmAddress" />
          </div>
          <p v-if="!inputAddress" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ $t('input.empty') }}</p>
          <p v-else-if="invalidAddresses.length > 0" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ invalidAddresses.length }} {{ $t('input.invalid_count') }}</p>
        </section>

        <!-- Batch Controls (Custom Prefix + Export) -->
        <USeparator v-if="validAddresses.length > 1" />
        <section v-if="validAddresses.length > 1">
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('batch.custom_prefix') }}
              </label>
              <UInput
                v-model="newPrefix"
                placeholder="osmos"
                @input.once="onInputPrefix"
              />
            </div>
            <div class="flex gap-2">
              <UButton color="success" :label="$t('batch.export_csv')" @click="exportBatchResults('csv')" />
              <UButton color="success" :label="$t('batch.export_json')" @click="exportBatchResults('json')" />
            </div>
          </div>
        </section>

        <!-- Converted Addresses Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('converted.title') }}</h2>

          <!-- Single Address Mode or Empty State -->
          <div v-if="validAddresses.length <= 1" class="space-y-4">
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('converted.cosmos') }}</label>
                <UButton
                  v-if="shouldShowWarningForCosmos"
                  icon="heroicons:exclamation-triangle"
                  variant="ghost"
                  color="warning"
                  size="xs"
                  @click="scrollToWarning"
                />
              </div>
              <div class="col-span-2">
                <CopyableField :value="convertedCosmosAddress" />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('converted.evm') }}</label>
                <UButton
                  v-if="shouldShowWarningForEvm"
                  icon="heroicons:exclamation-triangle"
                  variant="ghost"
                  color="warning"
                  size="xs"
                  @click="scrollToWarning"
                />
              </div>
              <div class="col-span-2">
                <CopyableField :value="convertedEvmAddress" />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('converted.custom') }}</label>
                <UInput
                  v-model="newPrefix"
                  placeholder="osmos"
                  size="xs"
                  class="w-24"
                  @input.once="onInputPrefix"
                />
              </div>
              <div class="col-span-2">
                <CopyableField :value="convertedPrefixAddress" />
              </div>
            </div>
          </div>

          <!-- Batch Mode -->
          <div v-else class="space-y-4">
            <!-- Column Visibility Controls -->
            <div class="flex flex-wrap gap-4 p-3 bg-(--ui-bg-elevated) rounded-md">
              <UCheckbox v-model="visibleColumns.input" :label="$t('batch.input')" />
              <UCheckbox v-model="visibleColumns.cosmos" :label="$t('converted.cosmos')" />
              <UCheckbox v-model="visibleColumns.evm" :label="$t('converted.evm')" />
              <UCheckbox v-if="newPrefix" v-model="visibleColumns.custom" :label="newPrefix" />
            </div>

            <div class="w-full">
              <table class="w-full text-sm text-gray-700 dark:text-gray-300 table-fixed">
                <colgroup>
                  <col v-if="visibleColumns.input" class="w-1/2">
                  <col v-if="visibleColumns.cosmos" class="w-1/2">
                  <col v-if="visibleColumns.evm" class="w-1/2">
                  <col v-if="visibleColumns.custom && newPrefix" class="w-1/2">
                </colgroup>
                <thead class="border-b border-gray-300 dark:border-gray-600">
                  <tr>
                    <th v-if="visibleColumns.input" class="py-3 px-2 text-left font-medium">{{ $t('batch.input') }}</th>
                    <th v-if="visibleColumns.cosmos" class="py-3 px-2 text-left font-medium">{{ $t('converted.cosmos') }}</th>
                    <th v-if="visibleColumns.evm" class="py-3 px-2 text-left font-medium">{{ $t('converted.evm') }}</th>
                    <th v-if="visibleColumns.custom && newPrefix" class="py-3 px-2 text-left font-medium">{{ newPrefix }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(addr, idx) in validAddresses" :key="idx" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td v-if="visibleColumns.input" class="py-2 px-2">
                      <CopyButton :value="addr" :index="idx" field="input" :is-copied="copiedIndex === idx && copiedField === 'input'" @copy="copyToClipboard(addr, idx, 'input')" />
                    </td>
                    <td v-if="visibleColumns.cosmos" class="py-2 px-2">
                      <CopyButton :value="batchConversions[idx].cosmos" :index="idx" field="cosmos" :is-copied="copiedIndex === idx && copiedField === 'cosmos'" @copy="copyToClipboard(batchConversions[idx].cosmos, idx, 'cosmos')" />
                    </td>
                    <td v-if="visibleColumns.evm" class="py-2 px-2">
                      <CopyButton :value="batchConversions[idx].evm" :index="idx" field="evm" :is-copied="copiedIndex === idx && copiedField === 'evm'" @copy="copyToClipboard(batchConversions[idx].evm, idx, 'evm')" />
                    </td>
                    <td v-if="visibleColumns.custom && newPrefix" class="py-2 px-2">
                      <CopyButton :value="batchConversions[idx].custom" :index="idx" field="custom" :is-copied="copiedIndex === idx && copiedField === 'custom'" @copy="copyToClipboard(batchConversions[idx].custom, idx, 'custom')" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </UCard>

      <!-- Info Sections -->
      <UCard :ui="{ body: 'space-y-6' }">
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('bech32.title') }}</h2>
          <div class="info-section space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>{{ $t('bech32.text') }}</p>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">{{ $t('bech32.useful') }}</h3>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(usecase, index) in $tm('bech32.usecases')" :key="index">{{ $rt(usecase) }}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('batch.feature.title') }}</h2>
          <div class="info-section space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>{{ $t('batch.feature.description') }}</p>
            <ul class="list-disc list-inside space-y-1 mt-3">
              <li v-for="(feature, index) in $tm('batch.feature.features')" :key="index">{{ $rt(feature) }}</li>
            </ul>
          </div>
        </section>

        <section ref="warningSection">
          <div class="flex items-center gap-2 mb-4">
            <Icon
              v-if="shouldShowAnyWarning"
              name="heroicons:exclamation-triangle"
              class="w-6 h-6 text-amber-500 dark:text-amber-400"
            />
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('warning.title') }}</h2>
          </div>
          <div class="info-section space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <i18n-t keypath="warning.text.derivation" scope="global">
                  <a
                    href="https://www.ledger.com/blog/understanding-crypto-addresses-and-derivation-paths"
                    target="_blank"
                    rel="noopener noreferrer">{{ $t('warning.text.derivation_link') }}</a>
                  <a
                    href="https://github.com/satoshilabs/slips/blob/master/slip-0044.md"
                    target="_blank"
                    rel="noopener noreferrer">{{ $t('warning.text.slip44_link') }}</a>
                  <a
                    href="https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e"
                    target="_blank"
                    rel="noopener noreferrer">{{ $t('warning.text.cosmos_link') }}</a>
              </i18n-t>
            </p>
            <p>{{ $t('warning.text.2') }}</p>
            <p>
              <i18n-t keypath="warning.text.chains" scope="global">
                  <a
                    href="https://docs.evmos.org/protocol/concepts/accounts#evmos-accounts"
                    target="_blank"
                    rel="noopener noreferrer">{{ $t('warning.text.evmos_link') }}</a>
              </i18n-t>
            </p>
            <p>{{ $t('warning.text.4') }}</p>
            <p>
              <i18n-t keypath="warning.text.cosmostation" scope="global">
                  <a
                    href="https://github.com/cosmostation/cosmostation-ios?tab=readme-ov-file#supporting-chains-cosmos"
                    target="_blank"
                    rel="noopener noreferrer">{{ $t('warning.text.cosmostation_link') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('eip55.title') }}</h2>
          <div class="info-section space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <i18n-t keypath="eip55.text" scope="global">
                <a href="https://eips.ethereum.org/EIPS/eip-55" target="_blank" rel="noopener noreferrer">{{ $t('eip55.eip55_link') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('source.title') }}</h2>
          <div class="info-section space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <i18n-t keypath="source.text" scope="global">
                <a href="https://github.com/williamchong/bech32-web-converter" target="_blank" rel="noopener noreferrer">{{ $t('links.github') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ $t('about.title') }}</h2>
          <div class="info-section space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <i18n-t keypath="about.text" scope="global">
                <a href="https://blog.williamchong.cloud" target="_blank" rel="noopener noreferrer">{{ $t('links.blog') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>
      </UCard>
    </UContainer>
  </div>
</template>
<script setup lang="ts">
import { useStorage, refAutoReset, useClipboard } from '@vueuse/core'
import { bech32 } from 'bech32'
import { convertCosmosToEvm, convertEvmToCosmos } from '~/utils/address'
import { Buffer } from 'buffer'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const textareaRef = ref<{ textareaRef: HTMLTextAreaElement | null } | null>(null)
const inputAddress = ref('')
const newPrefix = useStorage<string | null>('bech32-converter-new-prefix', '', undefined, { initOnMounted: true })
const hasKeplr = ref(false)
const hasEvmWallet = ref(false)
const copiedIndex = refAutoReset<number | null>(null, 2000)
const copiedField = refAutoReset<string | null>(null, 2000)
const visibleColumns = ref({
  input: true,
  cosmos: true,
  evm: true,
  custom: true
})

const validateAddress = (addr: string): boolean => {
  const trimmed = addr.trim()
  if (!trimmed) return false

  const isEthereum = /^(0x)?[0-9a-fA-F]{40}$/.test(trimmed)

  if (isEthereum) return true

  try {
    bech32.decode(trimmed)
    return true
  } catch {
    return false
  }
}

const parseAddresses = (input: string): string[] => {
  return input
    .split('\n')
    .map(addr => addr.trim())
    .filter(addr => addr.length > 0)
}

const validAddresses = computed(() => {
  return parseAddresses(inputAddress.value).filter(validateAddress)
})

const invalidAddresses = computed(() => {
  return parseAddresses(inputAddress.value).filter(addr => !validateAddress(addr))
})

const convertAddress = (addr: string) => {
  const trimmed = addr.trim()
  const isEthereum = /^(0x)?[0-9a-fA-F]{40}$/.test(trimmed)

  try {
    const words = isEthereum
      ? bech32.toWords(Buffer.from(trimmed.replace('0x', ''), 'hex'))
      : bech32.decode(trimmed).words

    return {
      cosmos: isEthereum ? convertEvmToCosmos(trimmed) : bech32.encode('cosmos', words),
      evm: isEthereum ? trimmed : convertCosmosToEvm(trimmed),
      custom: newPrefix.value ? bech32.encode(newPrefix.value, words) : ''
    }
  } catch {
    return { cosmos: '', evm: '', custom: '' }
  }
}

const batchConversions = computed(() => {
  return validAddresses.value.map(convertAddress)
})

onMounted(() => {
  const el = textareaRef.value?.textareaRef
  if (el && el.value) {
    inputAddress.value = el.value as string
  }
  onNuxtReady(()=> {
    hasKeplr.value = typeof window.keplr !== 'undefined'
    hasEvmWallet.value = typeof window.ethereum !== 'undefined'
  })
})

// For single address mode (backward compatibility)
const currentAddress = computed(() => {
  return validAddresses.value.length === 1 ? validAddresses.value[0] : ''
})

const isInputEthereum = computed(() => {
  return /^(0x)?[0-9a-fA-F]{40}$/.test(currentAddress.value)
})

const convertedWords = computed(() => {
  try {
    return isInputEthereum.value ? bech32.toWords(Buffer.from(currentAddress.value.replace('0x', ''), 'hex')) : bech32.decode(currentAddress.value).words
  } catch {
    return []
  }
})

const convertedPrefixAddress = computed(() => {
  if (!newPrefix.value || convertedWords.value.length === 0) return '';
  return bech32.encode(newPrefix.value, convertedWords.value)
})

const convertedCosmosAddress = computed(() => {
  if (convertedWords.value.length === 0) return ''
  return isInputEthereum.value
    ? convertEvmToCosmos(currentAddress.value)
    : bech32.encode('cosmos', convertedWords.value)
})

const convertedEvmAddress = computed(() => {
  if (convertedWords.value.length === 0) return ''
  return isInputEthereum.value
    ? currentAddress.value
    : convertCosmosToEvm(currentAddress.value)
})

async function getKeplrCosmosAddress() {
  useTrackEvent('connect_keplr')
  try {
    const chainId = 'cosmoshub-4';
    await window.keplr.enable(chainId);

    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    useTrackEvent('connect_keplr_success')
    inputAddress.value = accounts[0].address;
  } catch (e) {
    console.error('Keplr connection failed:', e)
  }
}

async function getEvmAddress() {
  useTrackEvent('connect_ethereum')
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    useTrackEvent('connect_ethereum_success')
    inputAddress.value = accounts[0];
  } catch (e) {
    console.error('EVM wallet connection failed:', e)
  }
}

function onInputAddress() {
  useTrackEvent('input_address')
}

function onInputPrefix() {
  useTrackEvent('input_prefix')
}

const warningSection = ref<HTMLElement | null>(null)

const shouldShowWarningForEvm = computed(() => {
  return convertedWords.value.length > 0 && !isInputEthereum.value
})

const shouldShowWarningForCosmos = computed(() => {
  return convertedWords.value.length > 0 && isInputEthereum.value
})

const shouldShowAnyWarning = computed(() => {
  return shouldShowWarningForEvm.value || shouldShowWarningForCosmos.value
})

function scrollToWarning() {
  warningSection.value?.scrollIntoView({ behavior: 'smooth' })
  useTrackEvent('click_warning')
}

const { copy } = useClipboard()

function copyToClipboard(text: string, index?: number, field?: string): void {
  if (!text) return
  copy(text).then(() => {
    useTrackEvent('copy_address')
    if (index !== undefined && field !== undefined) {
      copiedIndex.value = index
      copiedField.value = field
    }
  })
}

function getBatchExportData(): Array<Record<string, string>> {
  return validAddresses.value.map((addr, idx) => {
    const conversion = batchConversions.value[idx]
    const row: Record<string, string> = {}

    if (visibleColumns.value.input) {
      row.input = addr
    }
    if (visibleColumns.value.cosmos) {
      row.cosmos = conversion.cosmos
    }
    if (visibleColumns.value.evm) {
      row.evm = conversion.evm
    }
    if (visibleColumns.value.custom && newPrefix.value) {
      row[newPrefix.value] = conversion.custom
    }

    return row
  })
}

function exportBatchResults(format: 'csv' | 'json'): void {
  if (format === 'csv') {
    const data = getBatchExportData()
    const headers = Object.keys(data[0] || {})
    const rows = data.map(row => headers.map(header => row[header]))
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    downloadFile(csvContent, 'batch-conversion.csv', 'text/csv')
  } else {
    const jsonContent = JSON.stringify(getBatchExportData(), null, 2)
    downloadFile(jsonContent, 'batch-conversion.json', 'application/json')
  }
  useTrackEvent(`export_${format}`)
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

</script>
