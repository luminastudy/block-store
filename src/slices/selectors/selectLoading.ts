/**
 * Selector for loading state
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'

/**
 * Get loading state
 */
export const selectLoading = (state: { luminaJson: BlockStoreState }) =>
  state.luminaJson.loading
