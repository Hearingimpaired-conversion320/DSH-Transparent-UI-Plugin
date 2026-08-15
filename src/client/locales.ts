/** `settings.aqua` namespace dictionaries (the settings-row copy). */

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.aqua'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'aqua.title': '深海主题',
  'aqua.description': '沉浸式深海配色、统一圆角、环境辉光与可调玻璃',
  'aqua.enable': '开启',
  'aqua.disable': '关闭',
  'aqua.blur': '玻璃模糊度',
  'aqua.frost': '磨砂度',
  'aqua.fluidHue': '背景流体颜色',
  'aqua.background': '背景',
  'aqua.backgroundFluid': '流体',
  'aqua.backgroundWallpaper': '壁纸',
  'aqua.chooseWallpaper': '选择图片',
  'aqua.wallpaperBlur': '壁纸模糊度',
  'aqua.wallpaperFrost': '壁纸磨砂度',
} satisfies Record<string, string>

export type AquaLocaleKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Aqua settings row's copy. */
    'settings.aqua': AquaLocaleKey
  }
}

/** English dictionary. */
export const en = {
  'aqua.title': 'Deep-sea theme',
  'aqua.description': 'Immersive deep-sea palette, unified corners, ambient glow, and tunable glass',
  'aqua.enable': 'On',
  'aqua.disable': 'Off',
  'aqua.blur': 'Glass blur',
  'aqua.frost': 'Frost',
  'aqua.fluidHue': 'Fluid color',
  'aqua.background': 'Backdrop',
  'aqua.backgroundFluid': 'Fluid',
  'aqua.backgroundWallpaper': 'Wallpaper',
  'aqua.chooseWallpaper': 'Choose image',
  'aqua.wallpaperBlur': 'Wallpaper blur',
  'aqua.wallpaperFrost': 'Wallpaper frost',
} satisfies Record<AquaLocaleKey, string>
