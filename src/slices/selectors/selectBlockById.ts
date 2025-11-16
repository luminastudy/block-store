/**
 * Selector for getting a block by ID
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'
import type { Block } from '../../types/Block.js'
import { selectAllBlocks } from './selectAllBlocks.js'

/**
 * Get a block by ID across all sources
 */
export const selectBlockById =
  (blockId: string) =>
  (state: { luminaJson: BlockStoreState }): Block | undefined => {
    const allBlocks = selectAllBlocks(state)
    for (const block of allBlocks) {
      if (block.id === blockId) {
        return block
      }
    }
    return undefined
  }
