/**
 * Aqua row slot store: a mirror of the layer enable flag. The plugin's
 * apply-world change listener is the only writer; the row component reads
 * via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from the Aqua settings scope. */
export interface AquaRowState {
  /** Persisted layer enable flag. */
  enabled: boolean
  /** Monotonic revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type AquaRowActions = {
  sync: (draft: AquaRowState, enabled: boolean, revision: number) => void
}

/**
 * Declares the Aqua row state and write surface.
 * @returns the store handle.
 */
export function createAquaRowStore(): EngineStoreHandle<AquaRowState, AquaRowActions> {
  return defineStore({
    init: (): AquaRowState => ({ enabled: true, revision: -1 }),
    actions: {
      sync: (d, enabled: boolean, revision: number) => {
        if (revision <= d.revision) return
        d.enabled = enabled
        d.revision = revision
      },
    },
  })
}
