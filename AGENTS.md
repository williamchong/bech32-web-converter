# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `README.md` for setup, features, and tech stack.

## Commands

```bash
yarn dev          # Start dev server on http://localhost:3000
yarn build        # Production build (GitHub Pages)
yarn test         # Run tests (Vitest)
yarn test -t "pattern"  # Run a single test by name
yarn lint         # Run ESLint
yarn typecheck    # Run TypeScript type checking
```

CI runs lint, typecheck, test, and build in sequence (`.github/workflows/test.yml`).

## Architecture

Nuxt 3 single-page app (`pages/index.vue`) deployed on GitHub Pages (`.github/workflows/deploy.yml`).

### Core conversion logic

`utils/address.ts` — two main functions:
- `convertCosmosToEvm` — decodes bech32, extracts 20-byte address, applies EIP-55 checksum via keccak256
- `convertEvmToCosmos` — strips 0x prefix, converts hex to bech32 words, encodes with a prefix

These depend on `bech32` and `keccak256` npm packages, which require Node.js `Buffer`. A client-side polyfill in `plugins/node.client.ts` makes `Buffer` globally available in the browser. The `experimental.clientNodeCompat` flag and custom aliases in `nuxt.config.ts` handle additional Node module resolution for the browser environment.

### UI framework

Uses **Nuxt UI v3** with **Tailwind CSS v4**. Theme colors are configured in `app.config.ts` (primary: indigo, neutral: gray). Components use Nuxt UI primitives (`UCard`, `UTextarea`, `UButton`, `UBadge`, etc.).

### Composables

Uses VueUse composables extensively (`@vueuse/nuxt`): `useStorage` for localStorage persistence, `useClipboard` for copy functionality, `useColorMode`/`useCycleList` for dark mode, and `refAutoReset` for temporary UI state.

### Internationalization

Three locales in `i18n/locales/`: `en.json`, `zh.json` (Traditional Chinese), `ja.json` (Japanese). Strategy is `prefix_and_default` — English at `/`, others at `/zh/`, `/ja/`. All user-facing strings must use i18n keys via `useI18n()`.

### Monitoring

Sentry (`@sentry/nuxt`) for error tracking, `nuxt-gtag` for Google Analytics. Event tracking calls use `useTrackEvent()`.
