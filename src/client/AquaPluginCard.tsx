/**
 * Aqua card registered into the Plugins settings section's configurable tab
 * (`settings.plugin.item`): title + description + on/off toggle on top, and
 * three stepless slider + number knobs (glass blur, frost, fluid hue) below.
 * Every knob writes straight through to the layer, so the skin moves live.
 */
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.plugin.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { createAquaRowStore } from './settings-store.ts'
import css from './AquaPluginCard.module.css'

/** Injected business face: the enable write plus the three knob writes. */
export interface AquaPluginCardInjected {
  /** Switch the deep-sea layer on or off. */
  setEnabled: (enabled: boolean) => void
  /** Set the glass blur radius, px. */
  setBlur: (value: number) => void
  /** Set the glass frost amount, 0-100. */
  setFrost: (value: number) => void
  /** Set the fluid hue shift, degrees. */
  setFluidHue: (value: number) => void
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

/**
 * Render the Aqua plugin card.
 * @param props - composed slot props.
 * @returns the card list item.
 */
export function AquaPluginCard({ t, setEnabled, setBlur, setFrost, setFluidHue, useStore }: AquaPluginCardComponentProps) {
  const enabled = useStore(s => s.enabled)
  const blur = useStore(s => s.blur)
  const frost = useStore(s => s.frost)
  const fluidHue = useStore(s => s.fluidHue)
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
    </li>
  )
}
