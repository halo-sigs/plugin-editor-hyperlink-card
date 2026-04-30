# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Halo CMS plugin** (`editor-hyperlink-card`) that converts plain hyperlinks into rich card previews in the default editor. It consists of a Java backend (Spring WebFlux), a Vue-based editor UI, and Svelte Web Components for theme rendering.

The plugin requires Halo >= 2.22.0.

## Repository Structure

This is a **pnpm monorepo** with three layers:

### 1. Java Backend (`src/main/java/`)

Spring WebFlux plugin providing a link metadata API and theme asset injection.

- **`HyperLinkCardEndpoint`** — Custom endpoint at `GET /apis/api.hyperlink.halo.run/v1alpha1/link-detail?url=...`. Validates URLs and returns parsed metadata.
- **`HyperLinkCardService`** — Fetches link details with a 12-hour Guava cache.
- **`HyperLinkParser` / `HyperLinkParserFactory`** — Strategy pattern for site-specific parsers. `ParserType` maps hosts to parser beans. Default parser extracts OpenGraph/meta tags; specialized parsers exist for Bilibili and QQ Music.
- **`HyperLinkHeadProcessor`** — `TemplateHeadProcessor` that injects the Web Component script and CSS into theme page `<head>`.
- **Settings** (`src/main/resources/extensions/settings.yaml`) — Proxy configuration (host, port, host allowlist).

### 2. Editor UI (`ui/`)

Vue 3 + TipTap editor extensions that integrate with Halo’s default editor. Built with **Rsbuild** via `@halo-dev/ui-plugin-bundler-kit`.

- **Entry:** `ui/src/index.ts` registers three extensions via the `default:editor:extension:create` extension point.
- **Extensions** (`ui/src/editor/`):
  - `HyperlinkCardExtension` — Block-level card node (`hyperlink-card`). Supports `theme` (`regular` | `small` | `grid`), `href`, `target`, and custom title/description/image overrides.
  - `HyperlinkInlineCardExtension` — Inline card node (`hyperlink-inline-card`).
  - `TextBubbleExtension` — Adds bubble menu items for converting links to cards.
- **Components** (`ui/src/components/`) — Vue node views and bubble menu buttons rendered inside the editor.
- **Build output:** `src/main/resources/console` (production) or `build/resources/main/console` (development).

### 3. Web Components Package (`packages/hyperlink-card/`)

Svelte 5 custom elements that render the actual cards in themes. Built with **Vite** as both ES module and IIFE.

- **Custom elements:** `<hyperlink-card>` (block) and `<hyperlink-inline-card>` (inline).
- **Themes** (`src/themes/`) — `Regular`, `Small`, `Grid`, plus loading skeletons for each.
- **`src/index.ts`** — Registers the Svelte components and imports CSS variables (`var.css`).
- **Runtime behavior:** Each component fetches its own metadata from the backend API (`/apis/api.hyperlink.halo.run/v1alpha1/link-detail?url=...`). Supports overriding fields via `custom-title`, `custom-description`, and `custom-image` attributes.
- **Build output:** `dist/index.iife.js` and `dist/index.css`, copied by `vite-plugin-static-copy` to `src/main/resources/static`.

## Common Commands

### Build

```bash
# Build all JS packages (UI + hyperlink-card library)
pnpm build

# Full plugin build (frontend + Java)
./gradlew build
```

Gradle automatically runs `pnpm install` and `pnpm build` before `compileJava`.

### Development

```bash
# UI (editor extensions) — watch mode with dev env
# Outputs to build/resources/main/console for hot reloading in Halo
cd ui && pnpm dev

# Web component package — Vite dev server with proxy to local Halo (localhost:8090)
cd packages/hyperlink-card && pnpm dev
```

### Lint & Format

```bash
# Check ESLint + Prettier
pnpm lint

# Fix formatting
pnpm prettier
```

ESLint config is in `eslint.config.ts`. Rules differ by workspace:
- `ui/` — Vue + TypeScript (`@vue/eslint-config-typescript`)
- `packages/hyperlink-card/` — Svelte (`eslint-plugin-svelte`)

### Type Checking

```bash
# UI (Vue)
cd ui && pnpm type-check

# hyperlink-card (Svelte)
cd packages/hyperlink-card && pnpm check
```

### Tests

```bash
# Java tests
./gradlew test
```

There are currently no frontend test suites.

## Architecture Notes

### How the Three Layers Connect

1. **Editor** — The user inserts a hyperlink card in the Halo editor. The TipTap node stores attributes (`href`, `theme`, `custom-title`, etc.) and renders a Vue node view (`HyperlinkView`). On save, the node serializes to `<hyperlink-card>` HTML.
2. **Theme** — When a visitor views the post, `HyperLinkHeadProcessor` injects the IIFE bundle and CSS into the page. The browser renders the `<hyperlink-card>` custom element, which fetches metadata from the backend API and displays the appropriate Svelte theme.
3. **Backend** — The API endpoint receives the URL, selects a parser via `HyperLinkParserFactory` (based on host), fetches and parses the remote page, caches the result for 12 hours, and returns JSON.

### Adding a New Site-Specific Parser

1. Create a class implementing `HyperLinkParser<HyperLinkBaseDTO>`.
2. Register it as a `@Bean` in `HyperLinkParserConfiguration`.
3. Add the host-to-bean mapping in `ParserType`.

### Proxy Support

The plugin supports proxying requests to specific hosts. Configuration is defined in `extensions/settings.yaml` and consumed by `HttpClientFactory`.

### Dark Mode

The Web Components read CSS variables (e.g., `--halo-hyperlink-card-bg-color`). Dark mode is activated when an ancestor (`html` or `body`) has `color-scheme-dark`, `dark`, or `data-color-scheme="dark"`. See `README.md` for the full variable list.
