import { describe, it, expect } from 'vitest'
import { actions } from './actionsExport.js'

describe('actionsExport', () => {
  it('should export actions', () => {
    expect(actions).toBeDefined()
    expect(actions.removeLuminaJson).toBeDefined()
    expect(actions.clearSources).toBeDefined()
    expect(actions.clearError).toBeDefined()
  })
})
