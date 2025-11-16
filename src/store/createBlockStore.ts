/**
 * Redux store creation function
 */

import { configureStore } from '@reduxjs/toolkit'
import luminaJsonReducer from '../slices/luminaJsonReducer.js'

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
