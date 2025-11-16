/**
 * Selector for getting blocks from a specific source
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'
import type { Block } from '../../types/Block.js'

/**
 * Get blocks from a specific source
 */
export const selectBlocksFromSource =
  (sourceKey: string) =>
  (state: { luminaJson: BlockStoreState }): Block[] => {
    const sources = state.luminaJson.sources
    const descriptor = Object.getOwnPropertyDescriptor(sources, sourceKey)
    if (descriptor && descriptor.value) {
      return descriptor.value.luminaJson.blocks
    }
    return []
  }
