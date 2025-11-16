import { describe, it, expect } from 'vitest'
import { removeLuminaJson, clearSources, clearError } from './actions.js'

describe('actions', () => {
  it('should export actions', () => {
    expect(removeLuminaJson).toBeDefined()
    expect(clearSources).toBeDefined()
    expect(clearError).toBeDefined()
  })
})
