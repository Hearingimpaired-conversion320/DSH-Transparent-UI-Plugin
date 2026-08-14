# @deepseek-ai/dsh-client-ui-aqua

English | [中文](README.zh.md)

Aqua is a deep-sea glassmorphism theme layered over the DeepSeek Harness web UI. The header, sidebar, composer, stats line, and trajectory view all become panes of frosted glass floating over a slowly moving water backdrop, with the occasional fish and bubble drifting past. Dark mode is a blue-black sea; light mode is a cool blue-white. Everything sits behind a single toggle — switch it off and the stock UI comes back exactly, with no source changes to DSH itself. Install it and look under Settings → Plugins.

![](assets/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-08-14 222500.png)

![](assets/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-08-14 222524.png)

![](assets/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-08-14 222634.png)

![](assets/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-08-14 222656.png)

## Self-contained

Aqua is a **drop-in plugin for stock DSH** — it does not require any change to DSH core. Everything the stylesheet targets is either already in the stock UI (`data-composer-card`, `data-conversation-composer-overlay`, ARIA roles, lightningcss-preserved class-name substrings) or is **stamped at runtime** by the plugin's `seam-stamper` (a MutationObserver that adds the `data-dsh-*` / `data-hero-*` hooks to the matching elements as React mounts them). Space Grotesk is **embedded** in the bundle as a base64 `@font-face`; Chinese display text intentionally rides the system serif fallback (Songti / STSong / SimSun — Noto Serif SC is a multi-MB unicode-range face that cannot ship in a plugin). The enable flag is browser-local `localStorage`, so there is no Host settings-namespace dependency either.

## Installation

For a stock DSH deployment (the core packages must be published — see [Publishing](#publishing)):

1. Install the plugin into the profile that hosts the web client:

   ```sh
   npm install @deepseek-ai/dsh-client-ui-aqua@^0.1.0
   ```

2. Register it in the web profile's `cordis.patch.yml` (next to the other `dsh.client` plugins, e.g. after `ui-conversation`):

   ```yaml
   plugins:
     dsh.client:
       - insert:
           - id: ui-aqua
             name: '@deepseek-ai/dsh-client-ui-aqua'
   ```

3. Reload the web UI. Aqua is **on by default**; toggle it from **Settings → Plugins → Aqua**.

The plugin body (the theme layer, the seam stamper, the settings card) lives entirely in the `./client` export — the node-half `lib/index.js` is an empty `apply` placeholder kept for the host Loader's contract.

## Building

This repository ships **source and docs only**. `tsdown.config.ts` imports the monorepo preset at `../tsdown.client.ts`, so the bundle does not build in place. Build and publish Aqua from the DSH monorepo instead:

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-aqua run bundle
pnpm publish --filter @deepseek-ai/dsh-client-ui-aqua
```

Making this repo standalone-buildable (`npm run bundle`) is optional and not required for publishing. To do it, copy `packages/client/tsdown.client.ts` and `packages/client/web/src/platform.ts` into this repo and point the imports at the local copies.

## Publishing

A checklist for shipping a release:

1. **Version** — bump `package.json` `version` together with the core DSH packages (the monorepo versions `@deepseek-ai/dsh-client-*` in lockstep; `@deepseek-ai/cordis` is `4.x`).
2. **Peer deps** — the `peerDependencies` already use real semver ranges (`^0.1.0-rc.5` for the client packages, `^4.0.1` for cordis, `^18.2.0` for react); keep them aligned with the released core versions.
3. **Build** — `pnpm --filter @deepseek-ai/dsh-client-ui-aqua run bundle` (tsdown emits `lib/client.js` with the stylesheets + fonts inlined; `files` already whitelists the shipped artifacts).
4. **Publish** — `pnpm publish --filter @deepseek-ai/dsh-client-ui-aqua` (`publishConfig.access` is `public`). The core `@deepseek-ai/dsh-client-*` packages and `@deepseek-ai/cordis` must be published for the peer ranges to resolve.
5. **Fonts** — Space Grotesk is embedded (no step needed). If you later regenerate it, write `fonts.module.css` **without a UTF-8 BOM** (lightningcss rejects a BOM in a `.module.css` under `cssModules`).

## Model Experience

None. The layer is pure presentation — tokens, stylesheets, DOM attributes, and headline copy. It emits no cordis events, writes no session or settings content, and adds no prompt, context message, or tool schema.

#### KV Cache effect

None. No store, no durable document, no projection is written; the only persistence is the browser-local `localStorage` enable flag.

## Known Limitations and Deferred Work

- **Browser-local preference only** — the enable flag lives in `localStorage`, so the theme choice is per browser profile and cannot be defaulted or locked from a deployment configuration.
- **Greeting seam is DOM-level** — the hero headline is decorated by a MutationObserver rather than a first-class hero-greeting service; a locale switch while a blank hero is open rewrites the headline to the stock greeting until the next mount.
- **Runtime seam stamping** — the `data-dsh-*` hooks are attached by a `MutationObserver` instead of living in DSH core; a stock DSH update that renames the underlying class names (`sidebarCol`, `detailsCol`, `newSession`, `headlineText`, `fishHitbox`, `add`, `root`) would need the `SEAMS` selectors in `seam-stamper.ts` updated to match.
- **CJK display font** — Noto Serif SC is not embedded (multi-MB); Chinese headlines fall back to the system serif unless the host provides the face.
