/**
 * Aqua card registered into the Plugins settings section's configurable tab
 * (`settings.plugin.item`): title + description on the left, one-click
 * on/off toggle on the right. Off restores the stock appearance immediately
 * (every layer is an effect, disposed on flip).
 */
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.plugin.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { createAquaRowStore } from './settings-store.ts'
import css from './AquaPluginCard.module.css'

/** Injected business face: the enable write (t rides the standard locale seat). */
export interface AquaPluginCardInjected {
  /** Switch the deep-sea layer on or off. */
  setEnabled: (enabled: boolean) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AquaPluginCardComponentProps =
  PropsRuntime<'settings.plugin.item'> & PropsStore<ReturnType<typeof createAquaRowStore>>
  & PropsLocale<'settings.aqua'> & InjectFace<AquaPluginCardInjected>

/**
 * Render the Aqua plugin card.
 * @param props - composed slot props.
 * @returns the card list item.
 */
export function AquaPluginCard({ t, setEnabled, useStore }: AquaPluginCardComponentProps) {
  const enabled = useStore(s => s.enabled)
  return (
    <li className={css.card}>
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
    </li>
  )
}
