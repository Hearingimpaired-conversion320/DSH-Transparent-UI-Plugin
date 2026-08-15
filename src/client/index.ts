/**
 * Aqua client plugin body: the toggleable deep-sea skin. Owns the durable
 * enable flag (localStorage), applies/retracts the theme layer through
 * {@link AquaLayer}, and registers its on/off card into the Plugins settings
 * section (configurable tab) — one click returns the stock UI (every layer
 * is an effect, disposed on flip).
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.plugin.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import { AquaPluginCard, type AquaPluginCardInjected } from './AquaPluginCard.tsx'
import { createAquaRowStore } from './settings-store.ts'
import { en, NS, zh } from './locales.ts'
import { AquaLayer } from './theme-layer.ts'
// Side-effect imports: the theme-layer stylesheet (unloaded with the plugin)
// and the self-hosted Space Grotesk @font-face (no shell dependency).
import './aqua.module.css'
import './fonts.module.css'

/** Required services: theme override stack plus the settings-card surfaces. */
export const inject = ['theme', 'slots', 'locale']

/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aqua: settings card dictionaries')

  // The layer owns its lifecycle: enable flag, token stack, CSS attribute,
  // and the greeting observer are all effects released on disable/dispose.
  const layer = new AquaLayer(ctx)

  const store = createAquaRowStore()
  let bound: BoundActions<typeof store> | undefined
  let revision = 0
  const sync = (): void => {
    const s = layer.getSettings()
    bound?.sync({
      enabled: layer.getEnabled(),
      blur: s.blur,
      frost: s.frost,
      fluidHue: s.fluidHue,
      background: s.background,
      wallpaper: s.wallpaper,
      wallpaperBlur: s.wallpaperBlur,
      wallpaperFrost: s.wallpaperFrost,
    }, revision)
    revision += 1
  }
  const injected = (actions: BoundActions<typeof store>): AquaPluginCardInjected => {
    bound = actions
    // Re-sync from the layer so no flip is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync()
    return {
      setEnabled: (enabled) => {
        layer.setEnabled(enabled)
        sync()
      },
      setBlur: (blur) => {
        layer.setBlur(blur)
        sync()
      },
      setFrost: (frost) => {
        layer.setFrost(frost)
        sync()
      },
      setFluidHue: (fluidHue) => {
        layer.setFluidHue(fluidHue)
        sync()
      },
      setBackground: (background) => {
        layer.setBackground(background)
        sync()
      },
      setWallpaper: (wallpaper) => {
        layer.setWallpaper(wallpaper)
        sync()
      },
      setWallpaperBlur: (wallpaperBlur) => {
        layer.setWallpaperBlur(wallpaperBlur)
        sync()
      },
      setWallpaperFrost: (wallpaperFrost) => {
        layer.setWallpaperFrost(wallpaperFrost)
        sync()
      },
    }
  }
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    id: 'aqua',
    order: 5,
    store,
    locale: NS,
    inject: injected,
  }, AquaPluginCard))
}
