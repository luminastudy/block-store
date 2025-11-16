/**
 * Redux store configuration
 */

import { configureStore } from '@reduxjs/toolkit'
import blockReducer from './slices/blockSlice.js'

/**
 * Configure and create the Redux store
 *
 * @returns Configured Redux store
 */
export function createBlockStore() {
  return configureStore({
    reducer: {
      blocks: blockReducer,
    },
  })
}

/**
 * Export store type
 */
export type BlockStore = ReturnType<typeof createBlockStore>

/**
 * Export RootState type
 */
export type RootState = ReturnType<BlockStore['getState']>

/**
 * Export AppDispatch type
 */
export type AppDispatch = BlockStore['dispatch']
