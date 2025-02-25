<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Header -->
      <section class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('title') }}</h1>
        <p class="mt-2 text-gray-600">
          {{ $t('description') }}
        </p>
      </section>

      <div class="bg-white shadow rounded-lg p-6 space-y-6">
        <!-- Input Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('input.title') }}</h2>
          <input
            v-model="inputAddress"
            placeholder="cosmos1..../0xabcd...."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            @click.once="onInputAddress"
          >
          <div class="mt-4 flex gap-4">
            <button
              v-if="hasKeplr"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              @click="getKeplrCosmosAddress"
            >
              {{ $t('input.buttons.keplr') }}
            </button>
            <button
              v-if="hasEvmWallet"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              @click="getEvmAddress"
            >
              {{ $t('input.buttons.evm') }}
            </button>
          </div>
          <p v-if="!inputAddress" class="mt-2 text-sm text-gray-500">{{ $t('input.empty') }}</p>
          <p v-else-if="!isInputValid" class="mt-2 text-sm text-red-600">{{ $t('input.invalid') }}</p>
        </section>

        <!-- Converted Addresses Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('converted.title') }}</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">{{ $t('converted.cosmos') }}</label>
                <button v-if="shouldShowWarningForCosmos" class="text-amber-500" @click="scrollToWarning">
                  <WarningIcon class="w-5 h-5" />
                </button>
              </div>
              <div class="col-span-2">
                <CopyableField :value="convertedCosmosAddress" />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">{{ $t('converted.evm') }}</label>
                <button v-if="shouldShowWarningForEvm" class="text-amber-500" @click="scrollToWarning">
                  <WarningIcon class="w-5 h-5" />
                </button>
              </div>
              <div class="col-span-2">
                <CopyableField :value="convertedEvmAddress" />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">{{ $t('converted.custom') }}</label>
                <input
                  v-model="newPrefix"
                  placeholder="osmos"
                  class="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
                  @input.once="onInputPrefix"
                >
              </div>
              <div class="col-span-2">
                <CopyableField :value="convertedPrefixAddress" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Info Sections -->
      <div class="bg-white shadow rounded-lg p-6 space-y-6">
        <section ref="warningSection">
          <div class="flex items-center gap-2 mb-4">
            <WarningIcon v-if="shouldShowAnyWarning" class="w-6 h-6 text-amber-500" />
            <h2 class="text-xl font-semibold text-gray-900">{{ $t('warning.title') }}</h2>
          </div>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>
              <i18n-t keypath="warning.text.derivation" scope="global">
                  <a
                    href="https://www.ledger.com/blog/understanding-crypto-addresses-and-derivation-paths"
                    rel="noopener noreferrer">{{ $t('warning.text.derivation_link') }}</a>
                  <a
                    href="https://github.com/satoshilabs/slips/blob/master/slip-0044.md" 
                    rel="noopener noreferrer">{{ $t('warning.text.slip44_link') }}</a>
                  <a
                    href="https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e"
                    rel="noopener noreferrer">{{ $t('warning.text.cosmos_link') }}</a>
              </i18n-t>
            </p>
            <p>{{ $t('warning.text.2') }}</p>
            <p>
              <i18n-t keypath="warning.text.chains" scope="global">
                  <a
                    href="https://docs.evmos.org/protocol/concepts/accounts#evmos-accounts" 
                    rel="noopener noreferrer">{{ $t('warning.text.evmos_link') }}</a>
              </i18n-t>
            </p>
            <p>{{ $t('warning.text.4') }}</p>
            <p>
              <i18n-t keypath="warning.text.cosmostation" scope="global">
                  <a
                    href="https://github.com/cosmostation/cosmostation-ios?tab=readme-ov-file#supporting-chains-cosmos"
                    rel="noopener noreferrer">{{ $t('warning.text.cosmostation_link') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('eip55.title') }}</h2>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>
              <i18n-t keypath="eip55.text" scope="global">
                <a href="https://eips.ethereum.org/EIPS/eip-55" rel="noopener noreferrer">{{ $t('eip55.eip55_link') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('source.title') }}</h2>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>
              <i18n-t keypath="source.text" scope="global">
                <a href="https://github.com/williamchong/bech32-web-converter">{{ $t('links.github') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('about.title') }}</h2>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>
              <i18n-t keypath="about.text" scope="global">
                <a href="https://blog.williamchong.cloud">{{ $t('links.blog') }}</a>
              </i18n-t>
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import WarningIcon from '~/components/WarningIcon.vue'
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

const inputAddress = ref('')
const newPrefix = ref('')
const hasKeplr = ref(false)
const hasEvmWallet = ref(false)

const isInputEthereum = computed(() => {
  return /^(0x)?[0-9a-fA-F]{40}$/.test(inputAddress.value)
})

onMounted(() => {
  hasKeplr.value = typeof window.keplr !== 'undefined'
  hasEvmWallet.value = typeof window.ethereum !== 'undefined'
})

const convertedWords = computed(() => {
  try {
    return isInputEthereum.value ? bech32.toWords(Buffer.from(inputAddress.value.replace('0x', ''), 'hex')) : bech32.decode(inputAddress.value).words
  } catch {
    return []
  }
})

const isInputValid = computed(() => {
  return convertedWords.value.length > 0
})

const convertedPrefixAddress = computed(() => {
  if (!newPrefix.value || convertedWords.value.length === 0) return '';
  return bech32.encode(newPrefix.value, convertedWords.value)
})

const convertedCosmosAddress = computed(() => {
  if (convertedWords.value.length === 0) return ''
  return isInputEthereum.value
    ? convertEvmToCosmos(inputAddress.value)
    : inputAddress.value
})

const convertedEvmAddress = computed(() => {
  if (convertedWords.value.length === 0) return ''
  return isInputEthereum.value
    ? inputAddress.value
    : convertCosmosToEvm(inputAddress.value)
})

async function getKeplrCosmosAddress() {
  useTrackEvent('connect_keplr')
  const chainId = 'cosmoshub-4';
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  useTrackEvent('connect_keplr_success')
  inputAddress.value = accounts[0].address;
}

async function getEvmAddress() {
  useTrackEvent('connect_ethereum')
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  useTrackEvent('connect_ethereum_success')
  inputAddress.value = accounts[0];
}

function onInputAddress() {
  useTrackEvent('input_address')
}

function onInputPrefix() {
  useTrackEvent('input_prefix')
}

const warningSection = ref<HTMLElement | null>(null)

const shouldShowWarningForEvm = computed(() => {
  return isInputValid.value && !isInputEthereum.value
})

const shouldShowWarningForCosmos = computed(() => {
  return isInputValid.value && isInputEthereum.value
})

const shouldShowAnyWarning = computed(() => {
  return shouldShowWarningForEvm.value || shouldShowWarningForCosmos.value
})

function scrollToWarning() {
  warningSection.value?.scrollIntoView({ behavior: 'smooth' })
  useTrackEvent('click_warning')
}

</script>
