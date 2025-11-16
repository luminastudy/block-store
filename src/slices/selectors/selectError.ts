/**
 * Selector for error state
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'

/**
 * Get error state
 */
export const selectError = (state: { luminaJson: BlockStoreState }) =>
  state.luminaJson.error
