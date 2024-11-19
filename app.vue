<template>
  <div>
    <section>
      <h1>Bech32 Wallet Address Prefix Web Converter</h1>
      <p>Convert between Cosmos(cosmos1), Ethereum(0x) with checksum and different cosmos or EVM based chain using bech32 address prefixes.</p>
    </section>
    <hr>
    <section>
      <h2>Input Address</h2>
      <input v-model="inputAddress" placeholder="cosmos1..../0xabcd....">
      <br>
      <button v-if="hasKeplr" @click="getKeplrCosmosAddress">Connect Keplr</button>
      <button v-if="hasEvmWallet" @click="getEvmAddress">Connect Metamask/EVM Wallet</button>
      <p v-if="!inputAddress">Please input address</p>
      <p style="color: red" v-else-if="!isInputValid">Invalid Address Format</p>
    </section>
    <section>
      <h2>Converted Addresses</h2>
      <table>
        <tbody>
          <tr>
            <td>
              <label>Cosmos:</label>
            </td>
            <td>
              <code>{{ convertedCosmosAddress }}</code>
            </td>
          </tr>
          <tr>
            <td>
              <label>EVM/Ethereum:</label>
            </td>
            <td>
              <p><code>{{ convertedEvmAddress }}</code></p>
            </td>
          </tr>
          <tr>
            <td>
              <label>Custom Prefix: </label>
              <input v-model="newPrefix" placeholder="osmos">
            </td>
            <td>
              <code>{{ convertedPrefixAddress }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <hr>
    <section>
      <h2>Important Note about Cosmos(ATOM) vs EVM(ETH) Derivation Path</h2>
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

declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
    keccak256?: any;
  }
}

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
  } catch (e) {
    return []
  }
})

const isInputValid = computed(() => {
  return convertedWords.value.length > 0
})

const convertedPrefixAddress = computed(() => {
  if (!newPrefix.value || convertedWords.value.length === 0) return '-';
  return bech32.encode(newPrefix.value, convertedWords.value)
})

const convertedCosmosAddress = computed(() => {
  if (convertedWords.value.length === 0) return '-'
  return bech32.encode('cosmos', convertedWords.value)
})

const convertedEvmAddress = computed(() => {
  if (convertedWords.value.length === 0) return '-'
  const data = bech32.fromWords(convertedWords.value)
  const address = Buffer.from(data).toString('hex');
  const hash = window.keccak256(address).toString('hex');
  // Apply checksum
  let checksumAddress = '0x';
  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
})

async function getKeplrCosmosAddress() {
  const chainId = 'cosmoshub-4';
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  inputAddress.value = accounts[0].address;
}

async function getEvmAddress() {
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  inputAddress.value = accounts[0];
}

</script>
