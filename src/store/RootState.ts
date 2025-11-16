/**
 * RootState type definition
 */

import type { BlockStore } from './BlockStore.js'

/**
 * Export RootState type
 */
export type RootState = ReturnType<BlockStore['getState']>
