/**
 * Aqua theme layer: one toggleable visual skin over the whole Web surface.
 * Everything this layer owns is an effect — token overrides ride the theme
 * service's override stack, the CSS hooks ride a `data-dsh-aqua` attribute on
 * <html> (the stylesheet only applies under it), the hero copy rides a
 * MutationObserver that decorates new [data-hero-headline] mounts — so
 * switching the flag off (or unloading the plugin) restores the stock UI
 * exactly: no residue, no reload.
 *
 * The enable flag persists in localStorage: a client-only visual preference
 * (like the selected-session key), written and read by this plugin alone.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { ensureAmbientScene, removeAmbientScene } from './critters.ts'
import { attachFluidShader, SITE_FLUID_PARAMS, type FluidParams, type FluidShaderHandle } from './fluid-shader.ts'
import { attachFluidInteractions } from './fluid-interactions.ts'
import { startSeamStamper } from './seam-stamper.ts'

/** html attribute selecting the Aqua layer: CSS hooks and ambient effects. */
export const AQUA_ATTRIBUTE = 'data-dsh-aqua'

/** localStorage key carrying the layer enable flag. */
export const AQUA_ENABLED_KEY = 'dsh.ui-aqua.enabled'

/** Default state when nothing is stored yet: on. */
export const DEFAULT_ENABLED = true

/** The layer's identity in the theme override stack (inspection-visible). */
const OVERRIDE_SOURCE = '@deepseek-ai/dsh-client-ui-aqua'

const FONT_STACK = "'Space Grotesk Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', "
  + "'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif"

/** Scheme-invariant override value (applied to both palettes). */
const both = (value: string): { light: string; dark: string } => ({ light: value, dark: value })

/**
 * Alias-token override layer: the deep-sea palette. Every value is a
 * `{ light, dark }` pair so the layer stays legible when the user switches
 * the Appearance preference — dark is deep-sea navy, light is cool white-blue.
 */
export const AQUA_TOKEN_OVERRIDES: ThemeTokenOverrides = {
  // Typography: Space Grotesk for Latin/digits, CJK keeps the system stack.
  '--dsw-font-family': both(FONT_STACK),

  // Backgrounds.
  '--dsw-alias-bg-base': { light: '#F4F8FD', dark: '#0C121B' },
  '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#111A27' },
  '--dsw-alias-bg-layer-2': { light: '#ECF2FA', dark: '#162130' },
  '--dsw-alias-bg-layer-3': { light: '#E2EBF7', dark: '#1C2A3D' },
  '--dsw-alias-bg-overlay': { light: '#DCE7F4', dark: '#22334A' },
  '--dsw-alias-bg-module-platform': { light: '#FFFFFF', dark: '#111A27' },
  '--dsw-alias-bg-multi-select': { light: '#FFFFFF', dark: '#162130' },
  '--dsw-alias-bg-skeleton': { light: 'rgba(19, 45, 83, 0.08)', dark: 'rgba(148, 180, 220, 0.12)' },
  '--dsw-alias-bg-mask-1': { light: 'rgba(19, 37, 62, 0.3)', dark: 'rgba(4, 8, 14, 0.55)' },
  '--dsw-alias-bg-mask-2': { light: 'rgba(19, 37, 62, 0.12)', dark: 'rgba(4, 8, 14, 0.25)' },
  '--dsw-alias-bg-mask-3': { light: 'rgba(19, 37, 62, 0.3)', dark: 'rgba(4, 8, 14, 0.5)' },
  '--dsw-alias-bg-mask-drop': { light: 'rgba(244, 248, 253, 0.72)', dark: 'rgba(12, 18, 27, 0.7)' },

  // Hairlines and strokes.
  '--dsw-alias-border-l1': { light: 'rgba(19, 45, 83, 0.08)', dark: 'rgba(148, 180, 220, 0.08)' },
  '--dsw-alias-border-l2': { light: 'rgba(19, 45, 83, 0.14)', dark: 'rgba(148, 180, 220, 0.15)' },
  '--dsw-alias-border-l2-darkmode-thin': { light: 'rgba(19, 45, 83, 0.1)', dark: 'rgba(148, 180, 220, 0.1)' },
  '--dsw-alias-border-l3': { light: 'rgba(19, 45, 83, 0.22)', dark: 'rgba(148, 180, 220, 0.24)' },
  '--dsw-alias-border-l4': { light: 'rgba(19, 45, 83, 0.32)', dark: 'rgba(148, 180, 220, 0.34)' },
  '--dsw-alias-border-inverted': { light: 'rgba(19, 45, 83, 0.06)', dark: 'rgba(148, 180, 220, 0.12)' },
  '--dsw-alias-border-inverted2': { light: 'rgba(19, 45, 83, 0.08)', dark: 'rgba(148, 180, 220, 0.08)' },

  // Text ink.
  '--dsw-alias-label-primary': { light: '#13243E', dark: '#EAF2FC' },
  '--dsw-alias-label-secondary': { light: '#40597A', dark: '#AFC3DC' },
  '--dsw-alias-label-tertiary': { light: '#5D7696', dark: '#8399B5' },
  '--dsw-alias-label-caption': { light: '#7E93AC', dark: '#6B829F' },
  '--dsw-alias-label-dimmed': { light: '#C9D4E2', dark: '#4E5F76' },
  '--dsw-alias-label-primary-bluish': { light: '#2E5EB8', dark: '#BFD6F6' },
  '--dsw-alias-label-primary-dimmed': { light: '#1E3556', dark: '#D7E3F4' },
  '--dsw-alias-label-primary-inverted': { light: '#FFFFFF', dark: '#162130' },
  '--dsw-alias-label-primary-foreground': { light: '#FFFFFF', dark: '#FFFFFF' },

  // Brand (wordmark ink stays scheme ink; accents go business blue).
  '--dsw-alias-brand-primary': { light: '#13243E', dark: '#EAF2FC' },
  '--dsw-alias-brand-text': { light: '#13243E', dark: '#EAF2FC' },
  '--dsw-alias-brand-primary-invert': { light: '#FFFFFF', dark: '#0C121B' },
  '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: '#3F76D8', dark: '#6E9BE8' },

  // States.
  '--dsw-alias-state-business-primary': { light: '#3F76D8', dark: '#6E9BE8' },
  '--dsw-alias-state-business-tertiary': { light: '#DCE9FB', dark: '#1D2C44' },
  '--dsw-alias-state-success-tertiary': { light: '#DDF3E4', dark: '#12271C' },
  '--dsw-alias-state-warn-tertiary': { light: '#FCEED6', dark: '#2A2416' },

  // Buttons: the primary action becomes business blue with white ink.
  '--dsw-alias-button-primary-fill': { light: '#3F76D8', dark: '#4A7FD9' },
  '--dsw-alias-button-primary-hover': { light: '#5C8DE0', dark: '#5E8FE6' },
  '--dsw-alias-button-primary-dimmed': { light: '#DCE9FB', dark: '#162130' },
  '--dsw-alias-button-info-fill': { light: '#3F76D8', dark: '#6E9BE8' },
  '--dsw-alias-button-info-hover': { light: '#5C8DE0', dark: '#7FA8EF' },
  '--dsw-alias-button-elevated-fill': { light: '#FFFFFF', dark: '#162130' },
  '--dsw-alias-button-floating-fill': { light: '#FFFFFF', dark: '#162130' },
  '--dsw-alias-button-floating-hover': { light: '#F0F5FB', dark: '#1C2A3D' },
  '--dsw-alias-button-contrast-fill': { light: '#26364D', dark: '#EAF2FC' },
  '--dsw-alias-button-ghost-active-fill': { light: '#DCE7F4', dark: '#1C2A3D' },
  '--dsw-alias-button-ghost-active-hover': { light: '#E9F0F8', dark: '#162130' },
  '--dsw-alias-button-ghost-active-border': { light: '#8FA3BC', dark: '#6B829F' },

  // Interaction fills.
  '--dsw-alias-interactive-bg-hover': { light: 'rgba(63, 118, 216, 0.08)', dark: 'rgba(126, 164, 223, 0.1)' },
  '--dsw-alias-interactive-bg-hover-accent': { light: 'rgba(63, 118, 216, 0.14)', dark: 'rgba(126, 164, 223, 0.2)' },
  '--dsw-alias-interactive-bg-active': { light: 'rgba(63, 118, 216, 0.2)', dark: 'rgba(126, 164, 223, 0.26)' },
  '--dsw-alias-interactive-bg-hover-danger': { light: 'rgba(236, 19, 19, 0.05)', dark: 'rgba(242, 90, 90, 0.14)' },
  '--dsw-alias-interactive-bg-hover-solid': { light: '#F0F5FB', dark: '#1C2A3D' },

  // Markdown / code surfaces.
  '--dsw-alias-markdown-code-block': { light: '#F0F5FB', dark: '#0D141F' },
  '--dsw-alias-markdown-code-block-banner': { light: '#F5F8FD', dark: '#121B29' },
  '--dsw-alias-markdown-inline-code': { light: '#E4EDF8', dark: '#172334' },
  '--dsw-alias-markdown-citation': { light: '#EAF1F9', dark: '#1A2534' },
  '--dsw-alias-markdown-tag': { light: '#E4EDF8', dark: '#162130' },
  '--dsw-alias-markdown-placeholder': { light: '#EAF1F9', dark: '#131D2B' },
  '--dsw-alias-markdown-code-segment-selected': { light: '#FFFFFF', dark: '#1C2A3D' },
  '--dsw-alias-markdown-code-segment-unselected': { light: '#F0F5FB', dark: '#0F1723' },

  // Scrollbars.
  '--dsw-alias-scrollbar-bg-l1': { light: 'rgba(63, 118, 216, 0.28)', dark: 'rgba(126, 164, 223, 0.28)' },
  '--dsw-alias-scrollbar-bg-l2': { light: 'rgba(63, 118, 216, 0.4)', dark: 'rgba(126, 164, 223, 0.36)' },
  '--dsw-alias-scrollbar-hover-l1': { light: 'rgba(63, 118, 216, 0.5)', dark: 'rgba(126, 164, 223, 0.44)' },
  '--dsw-alias-scrollbar-hover-l2': { light: 'rgba(63, 118, 216, 0.6)', dark: 'rgba(126, 164, 223, 0.52)' },

  // Specific surfaces. The sidebar root fill goes transparent — the glass
  // panel styling lives on the column itself, so no double tint.
  '--dsw-specific-sidebar-fill': { light: 'transparent', dark: 'transparent' },
  '--dsw-specific-sidebar-nav-item-active': { light: '#DEE9F8', dark: '#1B283A' },
  '--dsw-specific-sidebar-nav-item-hover': { light: '#E9F0F8', dark: '#15202F' },
  '--dsw-specific-sidebar-nav-item-active-accent': { light: '#3F76D8', dark: '#6E9BE8' },
  '--dsw-specific-input-major': { light: '#FFFFFF', dark: '#101927' },
  '--dsw-specific-login-input': { light: '#F0F5FB', dark: '#0D141F' },
  '--dsw-specific-menu': { light: '#EAF1F9', dark: '#162130' },
  '--dsw-specific-selector': { light: '#EAF1F9', dark: '#1C2A3D' },
  '--dsw-specific-bubble': { light: '#F0F5FC', dark: '#121C2A' },
  '--dsw-specific-bubble-highlight': { light: '#DCE9FB', dark: '#1A283A' },
  '--dsw-specific-tip': { light: '#EAF1F9', dark: '#131D2B' },
  '--dsw-alias-toast-bg': { light: '#1B3256', dark: '#1C2A3D' },
  '--dsw-alias-tooltip-bg': { light: '#13243E', dark: '#162130' },

  // Elevation shadows (blue-tinted depth).
  '--dsw-shadow-lv1': { light: '0 2px 4px rgba(19, 45, 83, 0.06)', dark: '0 2px 4px rgba(2, 6, 14, 0.5)' },
  '--dsw-shadow-lv1-blur': { light: '0 4px 12px rgba(19, 45, 83, 0.05)', dark: '0 4px 12px rgba(2, 6, 14, 0.4)' },
  '--dsw-shadow-lv2': {
    light: '0 4px 12px rgba(19, 45, 83, 0.05), 0 2px 8px rgba(19, 45, 83, 0.06)',
    dark: '0 4px 12px rgba(2, 6, 14, 0.4), 0 2px 8px rgba(2, 6, 14, 0.35)',
  },
  '--dsw-shadow-lv3': {
    light: '0 0 1px rgba(19, 45, 83, 0.08), 0 12px 32px rgba(19, 45, 83, 0.12)',
    dark: '0 0 1px rgba(2, 6, 14, 0.6), 0 12px 32px rgba(2, 6, 14, 0.55)',
  },
}

/** Read the persisted enable flag (absent storage means on). */
function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? DEFAULT_ENABLED : raw === 'true'
  } catch {
    return DEFAULT_ENABLED
  }
}

/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
}

/** Tunable layer knobs, persisted independently of the enable flag. */
export interface AquaSettings {
  /** Glass backdrop blur radius, px. */
  blur: number
  /** Glass fill opacity, 0-100 (50 = the shipped look; drives the frost multiplier). */
  frost: number
  /** Fluid hue shift, degrees. */
  fluidHue: number
  /** Backdrop source: the living fluid board or a custom wallpaper. */
  background: 'fluid' | 'wallpaper'
  /** Wallpaper image data URL (empty until one is picked). */
  wallpaper: string
  /** Wallpaper blur radius, px. */
  wallpaperBlur: number
  /** Wallpaper frost veil, 0-100. */
  wallpaperFrost: number
}

const SETTINGS_DEFAULTS: AquaSettings = {
  blur: 2,
  frost: 20,
  fluidHue: 316,
  background: 'fluid',
  wallpaper: '',
  wallpaperBlur: 0,
  wallpaperFrost: 0,
}

/** Numeric knob keys and their localStorage names. */
const NUMERIC_KEYS = {
  blur: 'dsh.ui-aqua.blur',
  frost: 'dsh.ui-aqua.frost',
  fluidHue: 'dsh.ui-aqua.fluidHue',
  wallpaperBlur: 'dsh.ui-aqua.wallpaperBlur',
  wallpaperFrost: 'dsh.ui-aqua.wallpaperFrost',
} as const
type NumericKey = keyof typeof NUMERIC_KEYS

const BACKGROUND_KEY = 'dsh.ui-aqua.background'
const WALLPAPER_KEY = 'dsh.ui-aqua.wallpaper'

/** Clamp a numeric knob into its sane range. */
function clampSetting(key: NumericKey, value: number): number {
  const max = key === 'blur' || key === 'wallpaperBlur' ? 40 : key === 'frost' || key === 'wallpaperFrost' ? 100 : 360
  return Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : SETTINGS_DEFAULTS[key]
}

/** Read one numeric knob from localStorage (absent/parse failure means the default). */
function readSetting(key: NumericKey): number {
  try {
    const raw = localStorage.getItem(NUMERIC_KEYS[key])
    return raw === null ? SETTINGS_DEFAULTS[key] : clampSetting(key, Number(raw))
  } catch {
    return SETTINGS_DEFAULTS[key]
  }
}

/** Persist one numeric knob (storage failures keep the in-memory state). */
function writeSetting(key: NumericKey, value: number): void {
  try {
    localStorage.setItem(NUMERIC_KEYS[key], String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
}

/** Read the backdrop source ('fluid' or 'wallpaper'). */
function readBackground(): 'fluid' | 'wallpaper' {
  try {
    return localStorage.getItem(BACKGROUND_KEY) === 'wallpaper' ? 'wallpaper' : 'fluid'
  } catch {
    return 'fluid'
  }
}

/** Persist the backdrop source. */
function writeBackground(value: 'fluid' | 'wallpaper'): void {
  try {
    localStorage.setItem(BACKGROUND_KEY, value)
  } catch {
    /* in-memory state still applies */
  }
}

/** Read the wallpaper data URL (absent/oversized means empty). */
function readWallpaper(): string {
  try {
    return localStorage.getItem(WALLPAPER_KEY) ?? ''
  } catch {
    return ''
  }
}

/** Persist the wallpaper data URL (quota failures keep it in memory only). */
function writeWallpaper(value: string): void {
  try {
    localStorage.setItem(WALLPAPER_KEY, value)
  } catch {
    /* in-memory state still applies for this tab */
  }
}

/** Fluid palettes: one unified full-screen water. Dark inverts the official
 *  light look with luminous accent cores; light keeps strong blue contrast. */
const FLUID_PALETTES: Record<'light' | 'dark', FluidParams> = {
  light: {
    ...SITE_FLUID_PARAMS,
    color1: '#5B8DE0',
    color2: '#A9C6F5',
    color3: '#FFFFFF',
    distortion: 24,
    swirl: 14,
    offsetY: 40,
  },
  dark: {
    ...SITE_FLUID_PARAMS,
    color1: '#2D4F8D',
    color2: '#101E38',
    color3: '#0B1628',
    offsetY: 40,
  },
}

/** Current scheme from the presenter-owned body attribute. */
function activeScheme(): 'light' | 'dark' {
  return document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light'
}

/**
 * Owns the Aqua layer lifecycle: reads the durable enable flag, and applies /
 * retracts every layer on change. Cross-tab flips arrive through the storage
 * event; the greeting observer and every subscription are released when the
 * plugin fiber is disposed.
 */
export class AquaLayer {
  private enabled = false
  private settings: AquaSettings = { ...SETTINGS_DEFAULTS }
  private tokenDisposer: (() => void) | undefined
  private mainFluid: FluidShaderHandle | undefined
  private interactionDisposer: (() => void) | undefined
  private themeListener: (() => void) | undefined
  private seamDisposer: (() => void) | undefined
  private readonly ctx: Context

  /**
   * @param ctx - owning client context.
   */
  constructor(ctx: Context) {
    this.ctx = ctx
    ctx.effect(() => {
      const onStorage = (event: StorageEvent): void => {
        if (event.key === AQUA_ENABLED_KEY) {
          this.enabled = readEnabled()
          this.sync()
        }
        const key = event.key
        if (key !== null && (key in NUMERIC_KEYS || key === BACKGROUND_KEY || key === WALLPAPER_KEY)) {
          this.reloadSettings()
          if (this.enabled) this.applySettings()
        }
      }
      window.addEventListener('storage', onStorage)
      return () => {
        window.removeEventListener('storage', onStorage)
        this.unmount()
      }
    }, 'ui-aqua: layer lifecycle')
    this.enabled = readEnabled()
    this.reloadSettings()
    this.sync()
  }

  /** Current enable state (the settings row mirrors this). */
  getEnabled(): boolean {
    return this.enabled
  }

  /** Current knob values (the settings row mirrors these). */
  getSettings(): AquaSettings {
    return { ...this.settings }
  }

  /** Re-read every knob from localStorage into memory. */
  private reloadSettings(): void {
    this.settings = {
      blur: readSetting('blur'),
      frost: readSetting('frost'),
      fluidHue: readSetting('fluidHue'),
      background: readBackground(),
      wallpaper: readWallpaper(),
      wallpaperBlur: readSetting('wallpaperBlur'),
      wallpaperFrost: readSetting('wallpaperFrost'),
    }
  }

  /** Flip the layer: persist, then apply or retract every owned effect. */
  setEnabled(value: boolean): void {
    if (value === this.enabled) return
    this.enabled = value
    writeEnabled(value)
    this.sync()
  }

  /** Set the glass blur radius (px). */
  setBlur(value: number): void {
    const next = clampSetting('blur', value)
    if (next === this.settings.blur) return
    this.settings.blur = next
    writeSetting('blur', next)
    if (this.enabled) this.applySettings()
  }

  /** Set the glass frost amount (0-100). */
  setFrost(value: number): void {
    const next = clampSetting('frost', value)
    if (next === this.settings.frost) return
    this.settings.frost = next
    writeSetting('frost', next)
    if (this.enabled) this.applySettings()
  }

  /** Set the fluid hue shift (degrees). */
  setFluidHue(value: number): void {
    const next = clampSetting('fluidHue', value)
    if (next === this.settings.fluidHue) return
    this.settings.fluidHue = next
    writeSetting('fluidHue', next)
    if (this.enabled) this.applySettings()
  }

  /** Set the backdrop source (fluid board or custom wallpaper). */
  setBackground(value: 'fluid' | 'wallpaper'): void {
    if (value === this.settings.background) return
    this.settings.background = value
    writeBackground(value)
    if (this.enabled) this.applySettings()
  }

  /** Set the wallpaper image (a data URL; empty clears it). */
  setWallpaper(value: string): void {
    this.settings.wallpaper = value
    writeWallpaper(value)
    if (this.enabled) this.applySettings()
  }

  /** Set the wallpaper blur radius (px). */
  setWallpaperBlur(value: number): void {
    const next = clampSetting('wallpaperBlur', value)
    if (next === this.settings.wallpaperBlur) return
    this.settings.wallpaperBlur = next
    writeSetting('wallpaperBlur', next)
    if (this.enabled) this.applySettings()
  }

  /** Set the wallpaper frost veil (0-100). */
  setWallpaperFrost(value: number): void {
    const next = clampSetting('wallpaperFrost', value)
    if (next === this.settings.wallpaperFrost) return
    this.settings.wallpaperFrost = next
    writeSetting('wallpaperFrost', next)
    if (this.enabled) this.applySettings()
  }

  private sync(): void {
    if (this.enabled) this.mount()
    else this.unmount()
  }

  /** Write the knob-driven CSS variables onto <html>. */
  private applySettings(): void {
    const style = document.documentElement.style
    style.setProperty('--dsh-aqua-blur', `${this.settings.blur}px`)
    // Frost 0-100 → a 0-1.4 alpha multiplier (50 = 1x). Capped so max frost
    // stays translucent frosted glass instead of collapsing to a solid
    // opaque slab (the dark card would otherwise hit 100% and read as solid
    // navy).
    style.setProperty('--dsh-aqua-frost', String(Math.min(this.settings.frost / 50, 1.4)))
    style.setProperty('--dsh-aqua-fluid-hue', `${this.settings.fluidHue}deg`)
    style.setProperty('--dsh-aqua-wallpaper-blur', `${this.settings.wallpaperBlur}px`)
    style.setProperty('--dsh-aqua-wallpaper-frost', String(this.settings.wallpaperFrost / 100))

    // Backdrop source: flip the ambient container between fluid and wallpaper.
    const ambient = document.querySelector<HTMLElement>('[data-dsh-aqua-ambient]')
    if (ambient !== null) ambient.dataset.background = this.settings.background
    const img = document.querySelector<HTMLImageElement>('[data-dsh-aqua-wallpaper-img]')
    if (img !== null) {
      if (this.settings.background === 'wallpaper' && this.settings.wallpaper !== '') {
        img.src = this.settings.wallpaper
      } else {
        img.removeAttribute('src')
      }
    }
  }

  private mount(): void {
    document.documentElement.setAttribute(AQUA_ATTRIBUTE, '')
    ensureAmbientScene()
    this.applySettings()
    this.tokenDisposer = this.ctx.theme.overrideTokens(OVERRIDE_SOURCE, AQUA_TOKEN_OVERRIDES)
    this.mountFluid()
    this.startSeamStamper()
  }

  private unmount(): void {
    document.documentElement.removeAttribute(AQUA_ATTRIBUTE)
    this.tokenDisposer?.()
    this.tokenDisposer = undefined
    this.teardownFluid()
    removeAmbientScene()
    this.seamDisposer?.()
    this.seamDisposer = undefined
  }

  /** Attach the fluid shader and the interaction feeds. */
  private mountFluid(): void {
    const mainCanvas = document.querySelector<HTMLCanvasElement>('[data-dsh-aqua-fluid-canvas]')
    try {
      if (mainCanvas !== null) this.mainFluid = attachFluidShader(mainCanvas, this.fluidParams())
      // Palette follows the Appearance switch (theme/change re-emits on every flip).
      this.themeListener = this.ctx.on('theme/change', () => { this.applyFluidPalettes() })
      this.applyFluidPalettes()
      if (this.mainFluid !== undefined && mainCanvas !== null) {
        this.interactionDisposer = attachFluidInteractions({
          main: this.mainFluid,
          mainCanvas,
        })
      }
    } catch {
      // A GPU / driver failure must never take the glass theme down with it:
      // the ambient CSS wash still paints, only the WebGL water is skipped.
      this.mainFluid = undefined
    }
  }

  private teardownFluid(): void {
    this.themeListener?.()
    this.themeListener = undefined
    this.interactionDisposer?.()
    this.interactionDisposer = undefined
    this.mainFluid?.dispose()
    this.mainFluid = undefined
  }

  private fluidParams(): FluidParams {
    return FLUID_PALETTES[activeScheme()]
  }

  private applyFluidPalettes(): void {
    this.mainFluid?.setParams(this.fluidParams())
  }

  /** Stamp the data-* seams the stylesheet keys off (self-contained mode). */
  private startSeamStamper(): void {
    if (this.seamDisposer !== undefined) return
    this.seamDisposer = startSeamStamper()
  }
}
