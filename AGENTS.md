# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server on http://localhost:3000
yarn build        # Production build (Cloudflare Pages)
yarn preview      # Preview production build locally
yarn test         # Run tests (Vitest)
yarn lint         # Run ESLint
yarn typecheck    # Run TypeScript type checking
```

CI runs lint, typecheck, test, and build in sequence (`.github/workflows/test.yml`).

## Architecture

This is a **Nuxt 3** application that converts between Cosmos (bech32) and Ethereum (0x) wallet addresses. Deployed on **Cloudflare Pages**.

### Core conversion logic

`utils/address.ts` contains two main functions:
- `convertCosmosToEvm` — decodes bech32, extracts 20-byte address, applies EIP-55 checksum via keccak256
- `convertEvmToCosmos` — strips 0x prefix, converts hex to bech32 words, encodes with a prefix

These depend on `bech32` and `keccak256` npm packages, which require Node.js `Buffer`. A client-side polyfill in `plugins/node.client.ts` makes `Buffer` globally available in the browser. The `experimental.clientNodeCompat` flag and custom aliases in `nuxt.config.ts` handle additional Node module resolution for the browser environment.

### Page structure

The app is a single-page tool (`pages/index.vue`) with two modes:
- **Single address mode** — shows Cosmos, EVM, and custom-prefix conversions
- **Batch mode** — activates when multiple addresses are entered; provides a table with column toggles and CSV/JSON export

Wallet integration detects `window.keplr` (Cosmos) and `window.ethereum` (EVM) to auto-fill addresses.

### UI framework

Uses **Nuxt UI v3** with **Tailwind CSS v4**. Theme colors are configured in `app.config.ts` (primary: indigo, neutral: gray). Components use Nuxt UI primitives (`UCard`, `UTextarea`, `UButton`, `UBadge`, etc.).

### Internationalization

Three locales in `i18n/locales/`: `en.json`, `zh.json` (Traditional Chinese), `ja.json` (Japanese). Strategy is `prefix_and_default` — English at `/`, others at `/zh/`, `/ja/`. All user-facing strings must use i18n keys via `useI18n()`.

### Monitoring

Sentry (`@sentry/nuxt`) for error tracking, `nuxt-gtag` for Google Analytics. Event tracking calls use `useTrackEvent()`.
