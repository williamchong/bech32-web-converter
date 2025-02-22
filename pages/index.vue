<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Header -->
      <section class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Bech32 Wallet Address Prefix Web Converter</h1>
        <p class="mt-2 text-gray-600">
          Convert between Cosmos(cosmos1), Ethereum(0x) with checksum and different cosmos or EVM based chain using
          bech32 address prefixes.
        </p>
      </section>

      <div class="bg-white shadow rounded-lg p-6 space-y-6">
        <!-- Input Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Input Address</h2>
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
              Connect Keplr
            </button>
            <button
              v-if="hasEvmWallet"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              @click="getEvmAddress"
            >
              Connect Metamask/EVM Wallet
            </button>
          </div>
          <p v-if="!inputAddress" class="mt-2 text-sm text-gray-500">Please input address</p>
          <p v-else-if="!isInputValid" class="mt-2 text-sm text-red-600">Invalid Address Format</p>
        </section>

        <!-- Converted Addresses Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Converted Addresses</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">Cosmos:</label>
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
                <label class="text-sm font-medium text-gray-700">EVM/Ethereum:</label>
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
                <label class="text-sm font-medium text-gray-700">Custom Prefix:</label>
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
            <h2 class="text-xl font-semibold text-gray-900">Important Note about Cosmos (ATOM) vs EVM (ETH) Derivation Paths</h2>
          </div>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>Note that the <a
href="https://www.ledger.com/blog/understanding-crypto-addresses-and-derivation-paths"
                rel="noopener noreferrer">derivation path</a> (<a
                href="https://github.com/satoshilabs/slips/blob/master/slip-0044.md" rel="noopener noreferrer">SLIP44</a>)
              of <a
href="https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e"
                rel="noopener noreferrer">Cosmos/ATOM (118) addresses</a> is usually different from Ethereum/ETH <strong>(60)</strong>!</p>
            <p>This means this tool CANNOT calculate conversion between Cosmos and EVM addresses from a SEED PHRASE (<a
                href="https://www.ledger.com/academy/crypto/what-are-hierarchical-deterministic-hd-wallets"
                rel="noopener noreferrer">HD Wallet</a>).</p>
            <p>Some EVM-compatible Cosmos-SDK based chains (e.g., <a
                href="https://docs.evmos.org/protocol/concepts/accounts#evmos-accounts" rel="noopener noreferrer">
                Evmos</a>, Dymension) use 60 as the derivation path. Please be careful when you are converting prefixes
              based on
              these chains.</p>
            <p>On the other hand, if a PRIVATE KEY is used instead, the converted address would be correct for all chains.
            </p>
            <p>For an example list of derivation paths for different chains, please refer to <a
                href="https://github.com/cosmostation/cosmostation-ios?tab=readme-ov-file#supporting-chains-cosmos"
                rel="noopener noreferrer">this document by Cosmostation</a>.</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">What is an EVM Checksum Address (EIP-55)?</h2>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>A checksum address (<a href="https://eips.ethereum.org/EIPS/eip-55" rel="noopener noreferrer">EIP-55</a>) is a
              system for Ethereum addresses that adds a mix of uppercase and lowercase letters
              to help catch typing mistakes. By using a special method to decide which letters should be capitalized, it makes
              errors more obvious and helps ensure transactions go to the correct address.</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Source, Issues and Development</h2>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>Explore the <a href="https://github.com/williamchong/bech32-web-converter">GitHub repository</a> to view the source
              code, contribute to pull requests and issues.</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">About me</h2>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>Visit <a href="https://blog.williamchong.cloud">my blog</a> for more developer tips and stories.</p>
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
