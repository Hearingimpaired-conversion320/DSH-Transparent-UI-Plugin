/** `settings.aqua` namespace dictionaries (the settings-row copy). */

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.aqua'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'aqua.title': '玻璃主题',
  'aqua.description': '全局玻璃质感，云母/兼容双模式，模糊度、磨砂度、背景与颜色都可自由调节',
  'aqua.enable': '开启',
  'aqua.disable': '关闭',
  'aqua.mode': '模式',
  'aqua.modeMica': '云母效果',
  'aqua.modeCompat': '兼容模式',
  'aqua.modeHint': '云母效果把界面改成悬浮磨砂卡片；兼容模式保持原版排版，只把材质换成玻璃，并兼容其他插件的界面',
  'aqua.whale': '粒子鲸鱼',
  'aqua.whaleHint': '聊天区域正中央的粒子鲸鱼（deepseek.com/harness 同款）',
  'aqua.blur': '玻璃模糊度',
  'aqua.frost': '磨砂度',
  'aqua.fluidHue': '背景流体颜色',
  'aqua.bgBrightness': '背景亮度',
  'aqua.bgBrightnessHintDark': '深色模式：0 压暗至纯黑，50 原样',
  'aqua.bgBrightnessHintLight': '浅色模式：50 原样，100 提亮至纯白',
  'aqua.background': '背景',
  'aqua.backgroundFluid': '流体',
  'aqua.backgroundWallpaper': '壁纸',
  'aqua.wallpaper': '壁纸',
  'aqua.wallpaperHint': '浅色壁纸用浅色模式，深色壁纸用深色模式⚠️',
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
  'aqua.description': 'Global glassmorphism with mica/compatibility modes — blur, frost, backdrop, and color all adjustable',
  'aqua.enable': 'On',
  'aqua.disable': 'Off',
  'aqua.mode': 'Mode',
  'aqua.modeMica': 'Mica',
  'aqua.modeCompat': 'Compatibility',
  'aqua.modeHint': 'Mica restyles the UI into floating frosted cards; Compatibility keeps the stock layout and only swaps the material to glass, covering other plugins\' UI too',
  'aqua.whale': 'Particle whale',
  'aqua.whaleHint': 'The particle whale centered in the chat area (same as deepseek.com/harness)',
  'aqua.blur': 'Glass blur',
  'aqua.frost': 'Frost',
  'aqua.fluidHue': 'Fluid color',
  'aqua.bgBrightness': 'Background brightness',
  'aqua.bgBrightnessHintDark': 'Dark mode: 0 fades to pure black, 50 is unchanged',
  'aqua.bgBrightnessHintLight': 'Light mode: 50 is unchanged, 100 brightens to pure white',
  'aqua.background': 'Backdrop',
  'aqua.backgroundFluid': 'Fluid',
  'aqua.backgroundWallpaper': 'Wallpaper',
  'aqua.wallpaper': 'Wallpaper',
  'aqua.wallpaperHint': 'Use light mode for light wallpapers, dark mode for dark wallpapers ⚠️',
  'aqua.chooseWallpaper': 'Choose image',
  'aqua.wallpaperBlur': 'Wallpaper blur',
  'aqua.wallpaperFrost': 'Wallpaper frost',
} satisfies Record<AquaLocaleKey, string>
