import { describe, it, expect } from 'vitest'
import { reducer } from './reducerExport.js'

describe('reducerExport', () => {
  it('should be defined', () => {
    expect(reducer).toBeDefined()
  })
})
