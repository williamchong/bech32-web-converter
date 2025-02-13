import { bech32 } from 'bech32'
import keccak256 from 'keccak256'
import { Buffer } from 'buffer'

export function convertCosmosToEvm(cosmosAddress: string): string {
  const { words } = bech32.decode(cosmosAddress)
  const data = bech32.fromWords(words)
  const address = Buffer.from(data).toString('hex')
  const hash = keccak256(address).toString('hex')
  let checksumAddress = '0x'
  for (let i = 0; i < address.length; i++) {
    checksumAddress += parseInt(hash[i], 16) >= 8
      ? address[i].toUpperCase()
      : address[i]
  }
  return checksumAddress
}

export function convertEvmToCosmos(evmAddress: string): string {
  const cleanAddress = evmAddress.replace('0x', '')
  const words = bech32.toWords(Buffer.from(cleanAddress, 'hex'))
  return bech32.encode('cosmos', words)
}
