/**
 * Tests for store creation
 */

import { describe, it, expect } from 'vitest'
import { createBlockStore } from './createBlockStore.js'

describe('createBlockStore', () => {
  it('should create a Redux store', () => {
    const store = createBlockStore()
    expect(store).toBeDefined()
    expect(store.getState).toBeDefined()
    expect(store.dispatch).toBeDefined()
  })

  it('should have luminaJson reducer', () => {
    const store = createBlockStore()
    const state = store.getState()
    expect(state.luminaJson).toBeDefined()
    expect(state.luminaJson.sources).toBeDefined()
    expect(state.luminaJson.loading).toBe(false)
    expect(state.luminaJson.error).toBe(null)
  })
})
