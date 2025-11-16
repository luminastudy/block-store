import type { LuminaJsonSource } from './LuminaJsonSource.js'

/**
 * Redux state shape
 */
export interface BlockStoreState {
  /** Map of lumina.json sources keyed by "provider:organization:repository" */
  sources: Record<string, LuminaJsonSource>
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
}
