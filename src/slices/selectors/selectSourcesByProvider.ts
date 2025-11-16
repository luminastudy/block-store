/**
 * Selector for getting sources by provider
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'
import type { GitProvider } from '../../types/GitProvider.js'

/**
 * Get sources by provider
 */
export const selectSourcesByProvider =
  (provider: GitProvider) => (state: { luminaJson: BlockStoreState }) => {
    const sources = state.luminaJson.sources
    const keys = Object.keys(sources)
    const result = []
    for (const key of keys) {
      const descriptor = Object.getOwnPropertyDescriptor(sources, key)
      if (
        descriptor &&
        descriptor.value &&
        descriptor.value.provider === provider
      ) {
        result.push(descriptor.value)
      }
    }
    return result
  }
