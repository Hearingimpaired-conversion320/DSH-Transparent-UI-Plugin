/**
 * Aqua card registered into the Plugins settings section's configurable tab
 * (`settings.plugin.item`): title + description + on/off toggle on top, then
 * three glass knobs, a backdrop source picker (fluid / wallpaper), and — when
 * a wallpaper is active — a file picker plus two wallpaper knobs. Every write
 * goes straight through to the layer, so the skin moves live.
 */
import { useRef } from 'react'
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.plugin.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { createAquaRowStore } from './settings-store.ts'
import css from './AquaPluginCard.module.css'

/** Injected business face: the enable write plus the knob writes. */
export interface AquaPluginCardInjected {
  /** Switch the deep-sea layer on or off. */
  setEnabled: (enabled: boolean) => void
  /** Set the glass blur radius, px. */
  setBlur: (value: number) => void
  /** Set the glass frost amount, 0-100. */
  setFrost: (value: number) => void
  /** Set the fluid hue shift, degrees. */
  setFluidHue: (value: number) => void
  /** Set the backdrop source. */
  setBackground: (value: 'fluid' | 'wallpaper') => void
  /** Set the wallpaper image (a data URL). */
  setWallpaper: (value: string) => void
  /** Set the wallpaper blur radius, px. */
  setWallpaperBlur: (value: number) => void
  /** Set the wallpaper frost veil, 0-100. */
  setWallpaperFrost: (value: number) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AquaPluginCardComponentProps =
  PropsRuntime<'settings.plugin.item'> & PropsStore<ReturnType<typeof createAquaRowStore>>
  & PropsLocale<'settings.aqua'> & InjectFace<AquaPluginCardInjected>

interface KnobProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
}

/** One slider + number box, wired to a single value. */
function Knob({ label, value, min, max, step, unit, onChange }: KnobProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))
  return (
    <label className={css.knob}>
      <span className={css.knobLabel}>{label}</span>
      <input
        type="range"
        className={css.slider}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => { onChange(clamp(Number(e.target.value))) }}
      />
      <span className={css.numberWrap}>
        <input
          type="number"
          className={css.number}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => { onChange(clamp(Number(e.target.value))) }}
        />
        <span className={css.unit}>{unit}</span>
      </span>
    </label>
  )
}

/** Read a file, downscale to ≤1920px, and return a compact JPEG data URL. */
async function fileToDataUrl(file: File): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => { resolve(String(reader.result)) }
    reader.onerror = () => { reject(reader.error) }
    reader.readAsDataURL(file)
  })
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image()
    im.onload = () => { resolve(im) }
    im.onerror = () => { reject(new Error('image load failed')) }
    im.src = raw
  })
  const scale = Math.min(1, 1920 / Math.max(image.width, image.height))
  const w = Math.max(1, Math.round(image.width * scale))
  const h = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (ctx === null) return raw
  ctx.drawImage(image, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.82)
}

/**
 * Render the Aqua plugin card.
 * @param props - composed slot props.
 * @returns the card list item.
 */
export function AquaPluginCard(props: AquaPluginCardComponentProps) {
  const { t, setEnabled, setBlur, setFrost, setFluidHue, setBackground, setWallpaper, setWallpaperBlur, setWallpaperFrost, useStore } = props
  const enabled = useStore(s => s.enabled)
  const blur = useStore(s => s.blur)
  const frost = useStore(s => s.frost)
  const fluidHue = useStore(s => s.fluidHue)
  const background = useStore(s => s.background)
  const wallpaperBlur = useStore(s => s.wallpaperBlur)
  const wallpaperFrost = useStore(s => s.wallpaperFrost)
  const fileRef = useRef<HTMLInputElement | null>(null)

  return (
    <li className={css.card}>
      <div className={css.head}>
        <div className={css.text}>
          <div className={css.title}>{t('aqua.title')}</div>
          <div className={css.description}>{t('aqua.description')}</div>
        </div>
        <button
          type="button"
          className={css.toggle}
          aria-pressed={enabled}
          onClick={() => { setEnabled(!enabled) }}
        >
          <span className={css.check}>
            {enabled && <IconCheckOutline16 />}
          </span>
          {enabled ? t('aqua.enable') : t('aqua.disable')}
        </button>
      </div>

      <div className={css.controls}>
        <Knob label={t('aqua.blur')} value={blur} min={0} max={40} step={0.5} unit="px" onChange={setBlur} />
        <Knob label={t('aqua.frost')} value={frost} min={0} max={100} step={1} unit="%" onChange={setFrost} />
        <Knob label={t('aqua.fluidHue')} value={fluidHue} min={0} max={360} step={1} unit="°" onChange={setFluidHue} />
      </div>

      <div className={css.backdropRow}>
        <span className={css.backdropLabel}>{t('aqua.background')}</span>
        <div className={css.segmented}>
          <button
            type="button"
            className={background === 'fluid' ? css.segActive : css.seg}
            aria-pressed={background === 'fluid'}
            onClick={() => { setBackground('fluid') }}
          >
            {t('aqua.backgroundFluid')}
          </button>
          <button
            type="button"
            className={background === 'wallpaper' ? css.segActive : css.seg}
            aria-pressed={background === 'wallpaper'}
            onClick={() => { setBackground('wallpaper') }}
          >
            {t('aqua.backgroundWallpaper')}
          </button>
        </div>
      </div>

      {background === 'wallpaper' && (
        <div className={css.controls}>
          <div className={css.wallpaperPick}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={css.fileInput}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file !== undefined) {
                  void fileToDataUrl(file).then(setWallpaper)
                }
                e.target.value = ''
              }}
            />
            <button type="button" className={css.pickButton} onClick={() => { fileRef.current?.click() }}>
              {t('aqua.chooseWallpaper')}
            </button>
          </div>
          <Knob label={t('aqua.wallpaperBlur')} value={wallpaperBlur} min={0} max={40} step={0.5} unit="px" onChange={setWallpaperBlur} />
          <Knob label={t('aqua.wallpaperFrost')} value={wallpaperFrost} min={0} max={100} step={1} unit="%" onChange={setWallpaperFrost} />
        </div>
      )}
    </li>
  )
}
