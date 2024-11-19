<template>
  <div>
    <section>
      <h1>Bech32 Wallet Address Prefix Web Converter</h1>
      <p>Convert between Cosmos(cosmos1), Ethereum(0x) and different cosmos-based chain using bech32 address prefixes.</p>
    </section>
    <hr>
    <section>
      <h2>Input Address</h2>
      <input v-model="inputAddress" placeholder="cosmos1..../0xabcd....">
    </section>
    <section>
      <h2>Converted Addresses</h2>
      <label>New Prefix: </label>
      <input v-model="newPrefix" placeholder="osmos">
      <br>
      <code>{{ convertedPrefixAddress }}</code>
      <br>
      <label>Cosmos address</label>
      <br>
      <code>{{ convertedCosmosAddress }}</code>
      <br>
      <label>Ethereum / EVM hex address</label>
      <br>
      <code>{{ convertedEvmAddress }}</code>
    </section>
    <hr>
    <section>
      <h2>Important Note about Derivation Path</h2>
      <div>
        <p>Note that the derivation path(SLIP44) of cosmos/ATOM address(118) is usually different from Ethereum(ETH)
          address(60)!
          Some EVM compatible cosmos chain uses 60 as derivation path.</p>
        <p>That means this tool CANNOT calculate conversion between cosmos and evm address assuming user generate
          wallets using SEED PHRASE.
          On the other hand, if PRIVATE KEY is used instead, the converted address would be correct for chain.</p>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { bech32 } from 'bech32'
import { Buffer } from 'node:buffer'

const inputAddress = ref('')
const newPrefix = ref('')

const isInputEthereum = computed(() => {
  return /^(0x)?[0-9a-fA-F]{40}$/.test(inputAddress.value)
})

const convertedWords = computed(() => {
  try {
    return isInputEthereum.value ? bech32.toWords(Buffer.from(inputAddress.value.replace('0x', ''), 'hex')) : bech32.decode(inputAddress.value).words
  } catch (e) {
    return []
  }
})

const convertedPrefixAddress = computed(() => {
  if (convertedWords.value.length === 0) return newPrefix.value + '1....'
  return bech32.encode(newPrefix.value, convertedWords.value)
})

const convertedCosmosAddress = computed(() => {
  if (convertedWords.value.length === 0) return 'cosmos1....'
  return bech32.encode('cosmos', convertedWords.value)
})

const convertedEvmAddress = computed(() => {
  if (convertedWords.value.length === 0) return '0x....'
  const data = bech32.fromWords(convertedWords.value)
  return `0x${Buffer.from(data).toString('hex')}`;
})
</script>
