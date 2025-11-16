/**
 * AppDispatch type definition
 */

import type { BlockStore } from './BlockStore.js'

/**
 * Export AppDispatch type
 */
export type AppDispatch = BlockStore['dispatch']
