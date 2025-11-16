import { describe, it, expect } from 'vitest'
import { luminaJsonActions } from './luminaJsonActions.js'

describe('luminaJsonActions', () => {
  it('should export actions', () => {
    expect(luminaJsonActions).toBeDefined()
    expect(luminaJsonActions.removeLuminaJson).toBeDefined()
    expect(luminaJsonActions.clearSources).toBeDefined()
    expect(luminaJsonActions.clearError).toBeDefined()
  })
})
