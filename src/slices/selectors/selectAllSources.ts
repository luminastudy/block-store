/**
 * Selector for getting all sources
 */

import type { BlockStoreState } from '../../types/BlockStoreState.js'

/**
 * Get all lumina.json sources
 */
export const selectAllSources = (state: { luminaJson: BlockStoreState }) => {
  const sources = state.luminaJson.sources
  const keys = Object.keys(sources)
  const result = []
  for (const key of keys) {
    const source = Object.getOwnPropertyDescriptor(sources, key)
    if (source && source.value) {
      result.push(source.value)
    }
  }
  return result
}
