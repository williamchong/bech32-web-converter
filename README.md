# Bech32 Wallet Address Prefix Converter

Live demo: [bech32.williamchong.cloud](https://bech32.williamchong.cloud)

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

## Tech Stack

- [Nuxt 3](https://nuxt.com/) + [Vue 3](https://vuejs.org/)
- [Nuxt UI v3](https://ui.nuxt.com/) + [Tailwind CSS v4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) for testing
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)

## Prerequisites

- Node.js >= 20.20.0
- [Yarn](https://classic.yarnpkg.com/) (specified via corepack)

## Setup

```bash
corepack enable
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

## Testing

```bash
yarn test
yarn lint
yarn typecheck
```
