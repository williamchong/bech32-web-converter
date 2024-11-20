<template>
  <div>
    <section>
      <h1>Bech32 Wallet Address Prefix Web Converter</h1>
      <p>Convert between Cosmos(cosmos1), Ethereum(0x) with checksum and different cosmos or EVM based chain using
        bech32 address prefixes.</p>
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
              <CopyableField :value="convertedCosmosAddress" />
            </td>
          </tr>
          <tr>
            <td>
              <label>EVM/Ethereum:</label>
            </td>
            <td>
              <CopyableField :value="convertedEvmAddress" />
            </td>
          </tr>
          <tr>
            <td>
              <label>Custom Prefix: </label>
              <input v-model="newPrefix" placeholder="osmos">
            </td>
            <td>
              <CopyableField :value="convertedPrefixAddress" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <hr>
    <section>
      <h2>Important Note about Cosmos (ATOM) vs EVM (ETH) Derivation Paths for HD Wallets</h2>
      <div>
        <p>Note that the <a href="https://www.ledger.com/blog/understanding-crypto-addresses-and-derivation-paths"
            rel="noopener noreferrer">derivation path</a> (<a
            href="https://github.com/satoshilabs/slips/blob/master/slip-0044.md" rel="noopener noreferrer">SLIP44</a>)
          of <a href="https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e"
            rel="noopener noreferrer">Cosmos/ATOM (118) addresses</a> is usually different from Ethereum/ETH (60)!</p>
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
    <hr>
    <section>
      <h2>What is an EVM Checksum Address (EIP-55)?</h2>
      <p>A checksum address (<a href="https://eips.ethereum.org/EIPS/eip-55" rel="noopener noreferrer">EIP-55</a>) is a
        system for Ethereum addresses that adds a mix of uppercase and lowercase letters
        to help catch typing mistakes. By using a special method to decide which letters should be capitalized, it makes
        errors more obvious and helps ensure transactions go to the correct address.</p>
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
  if (!newPrefix.value || convertedWords.value.length === 0) return '';
  return bech32.encode(newPrefix.value, convertedWords.value)
})

const convertedCosmosAddress = computed(() => {
  if (convertedWords.value.length === 0) return ''
  return bech32.encode('cosmos', convertedWords.value)
})

const convertedEvmAddress = computed(() => {
  if (convertedWords.value.length === 0) return ''
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
