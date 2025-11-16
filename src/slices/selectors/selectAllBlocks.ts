/**
 * Selector for getting all blocks
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'
import type { Block } from '../../types/Block.js'

/**
 * Get all blocks from all sources
 */
export const selectAllBlocks = (state: {
  luminaJson: BlockStoreState
}): Block[] => {
  const sources = state.luminaJson.sources
  const keys = Object.keys(sources)
  const allBlocks: Block[] = []
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(sources, key)
    if (descriptor && descriptor.value) {
      const source = descriptor.value
      const blocks = source.luminaJson.blocks
      for (const block of blocks) {
        allBlocks.push(block)
      }
    }
  }
  return allBlocks
}
