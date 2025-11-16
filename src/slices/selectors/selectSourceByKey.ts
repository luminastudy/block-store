/**
 * Selector for getting a source by key
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'

/**
 * Get a specific source by key
 */
export const selectSourceByKey =
  (key: string) => (state: { luminaJson: BlockStoreState }) => {
    const sources = state.luminaJson.sources
    const descriptor = Object.getOwnPropertyDescriptor(sources, key)
    if (descriptor && descriptor.value) {
      return descriptor.value
    }
    return undefined
  }
