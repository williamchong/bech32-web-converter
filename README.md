# Bech32 Wallet Address Prefix Converter

Batch convert between Cosmos(cosmos1), Ethereum(0x) with checksum and different cosmos or EVM based chains using bech32 address prefixes. Process multiple addresses at once with CSV and JSON export support.

## Features

- **Batch Conversion**: Convert multiple addresses at once (up to 100+)
- **Single Address Mode**: Convert one address with detailed output
- **Multiple Formats**: Support for Cosmos (bech32) and Ethereum (0x) address formats
- **Custom Prefixes**: Generate addresses with custom bech32 prefixes (osmos, juno, etc.)
- **Export Options**: Export batch results as CSV or JSON
- **Column Toggle**: Show/hide individual columns in batch output
- **Wallet Integration**: Auto-fill addresses from Keplr (Cosmos) or MetaMask (EVM)
- **Dark Mode**: Built-in light/dark mode support
- **Multilingual**: Support for English, Chinese (中文), and Japanese (日本語)

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
