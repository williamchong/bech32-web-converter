import { describe, it, expect } from 'vitest'
import { bech32 } from 'bech32'
import { convertCosmosToEvm, convertEvmToCosmos } from '../utils/address'

describe('Address Conversion', () => {
  const testCases = [
    {
      cosmos: 'cosmos1qypqxpq9qcrsszg2pvxq6rs0zqg3yyc5lzv7xu',
      eth: '0x0102030405060708090a0B0c0d0e0f1011121314',
    },
    {
      cosmos: 'cosmos1jrmehaht938cwqm9u7zestslzq0f8wgxs05ukh',
      eth: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    },
  ]

  it('should convert Cosmos address to EVM address', () => {
    testCases.forEach(({ cosmos, eth }) => {
      expect(convertCosmosToEvm(cosmos)).toBe(eth)
    })
  })

  it('should convert EVM address to Cosmos address', () => {
    testCases.forEach(({ cosmos, eth }) => {
      expect(convertEvmToCosmos(eth)).toBe(cosmos)
    })
  })

  it('should convert address with custom prefix', () => {
    const { cosmos } = testCases[0]
    const { words } = bech32.decode(cosmos)
    const osmoAddress = bech32.encode('osmo', words)
    expect(osmoAddress).toMatch('osmo1qypqxpq9qcrsszg2pvxq6rs0zqg3yyc5helwsw')
  })
})
