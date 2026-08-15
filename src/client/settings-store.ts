/**
 * Aqua row slot store: a mirror of the layer's state (enable flag plus the
 * knobs and the backdrop source). The plugin's apply-world change listener is
 * the only writer; the row component reads via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from the Aqua settings scope. */
export interface AquaRowState {
  /** Persisted layer enable flag. */
  enabled: boolean
  /** Glass blur radius, px. */
  blur: number
  /** Glass frost amount, 0-100. */
  frost: number
  /** Fluid hue shift, degrees. */
  fluidHue: number
  /** Backdrop source: fluid board or custom wallpaper. */
  background: 'fluid' | 'wallpaper'
  /** Wallpaper image data URL. */
  wallpaper: string
  /** Wallpaper blur radius, px. */
  wallpaperBlur: number
  /** Wallpaper frost veil, 0-100. */
  wallpaperFrost: number
  /** Monotonic revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** The full payload the layer pushes into the row store on every change. */
export interface AquaSettingsPayload {
  enabled: boolean
  blur: number
  frost: number
  fluidHue: number
  background: 'fluid' | 'wallpaper'
  wallpaper: string
  wallpaperBlur: number
  wallpaperFrost: number
}

/** Declared action shape giving the exported factory a stable return type. */
type AquaRowActions = {
  sync: (draft: AquaRowState, next: AquaSettingsPayload, revision: number) => void
}

/**
 * Declares the Aqua row state and write surface.
 * @returns the store handle.
 */
export function createAquaRowStore(): EngineStoreHandle<AquaRowState, AquaRowActions> {
  return defineStore({
    init: (): AquaRowState => ({
      enabled: true,
      blur: 2,
      frost: 20,
      fluidHue: 316,
      background: 'fluid',
      wallpaper: '',
      wallpaperBlur: 0,
      wallpaperFrost: 0,
      revision: -1,
    }),
    actions: {
      sync: (d, next: AquaSettingsPayload, revision: number) => {
        if (revision <= d.revision) return
        d.enabled = next.enabled
        d.blur = next.blur
        d.frost = next.frost
        d.fluidHue = next.fluidHue
        d.background = next.background
        d.wallpaper = next.wallpaper
        d.wallpaperBlur = next.wallpaperBlur
        d.wallpaperFrost = next.wallpaperFrost
        d.revision = revision
      },
    },
  })
}
