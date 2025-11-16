/**
 * Redux store configuration
 */

import { configureStore } from '@reduxjs/toolkit'
import luminaJsonReducer from './slices/luminaJsonSlice.js'

/**
 * Configure and create the Redux store for managing lumina.json sources
 *
 * @returns Configured Redux store
 */
export function createBlockStore() {
  return configureStore({
    reducer: {
      luminaJson: luminaJsonReducer,
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
