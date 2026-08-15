/** `settings.aqua` namespace dictionaries (the settings-row copy). */

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.aqua'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'aqua.title': '深海主题',
  'aqua.description': '沉浸式深海配色、统一圆角、环境辉光与随机问候语',
  'aqua.enable': '开启',
  'aqua.disable': '关闭',
  'aqua.blur': '玻璃模糊度',
  'aqua.frost': '磨砂度',
  'aqua.fluidHue': '背景流体颜色',
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
  'aqua.description': 'Immersive deep-sea palette, unified corners, ambient glow, and rotating greetings',
  'aqua.enable': 'On',
  'aqua.disable': 'Off',
  'aqua.blur': 'Glass blur',
  'aqua.frost': 'Frost',
  'aqua.fluidHue': 'Fluid color',
} satisfies Record<AquaLocaleKey, string>
