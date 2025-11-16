/**
 * BlockStore type definition
 */

import type { createBlockStore } from './createBlockStore.js'

/**
 * Export store type
 */
export type BlockStore = ReturnType<typeof createBlockStore>
