/** `settings.aqua` namespace dictionaries (the settings-row copy). */

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.aqua'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'aqua.title': '玻璃主题',
  'aqua.description': '全局玻璃质感，漂浮/兼容双模式，模糊度、磨砂度、背景与颜色都可自由调节',
  'aqua.enable': '开启',
  'aqua.disable': '关闭',
  'aqua.disabledHint': '主题尚未开启——总开关在「插件」页的玻璃主题卡片里，打开后这里的调节才会显示效果',
  'aqua.mode': '模式',
  'aqua.modeFloat': '漂浮玻璃',
  'aqua.modeCompat': '兼容模式',
  'aqua.modeHint': '漂浮玻璃把界面改成悬浮玻璃卡片；兼容模式保持原版排版，只把材质换成玻璃，并兼容其他插件的界面',
  'aqua.blur': '玻璃模糊度',
  'aqua.frost': '磨砂度',
  'aqua.fluidHue': '背景流体颜色',
  'aqua.bgBrightness': '背景亮度',
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
  'aqua.title': 'Glass theme',
  'aqua.description': 'Global glassmorphism with floating/compatibility modes — blur, frost, backdrop, and color all adjustable',
  'aqua.enable': 'On',
  'aqua.disable': 'Off',
  'aqua.disabledHint': 'Theme is off — the master switch lives in the Plugins page; these adjustments show once it is on',
  'aqua.mode': 'Mode',
  'aqua.modeFloat': 'Floating glass',
  'aqua.modeCompat': 'Compatibility',
  'aqua.modeHint': 'Floating glass restyles the UI into floating cards; Compatibility keeps the stock layout and only swaps the material to glass, covering other plugins\' UI too',
  'aqua.blur': 'Glass blur',
  'aqua.frost': 'Frost',
  'aqua.fluidHue': 'Fluid color',
  'aqua.bgBrightness': 'Background brightness',
  'aqua.background': 'Backdrop',
  'aqua.backgroundFluid': 'Fluid',
  'aqua.backgroundWallpaper': 'Wallpaper',
  'aqua.chooseWallpaper': 'Choose image',
  'aqua.wallpaperBlur': 'Wallpaper blur',
  'aqua.wallpaperFrost': 'Wallpaper frost',
} satisfies Record<AquaLocaleKey, string>
