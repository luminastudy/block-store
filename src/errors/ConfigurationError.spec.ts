import { describe, it, expect } from 'vitest'
import { ConfigurationError } from './ConfigurationError.js'

describe('ConfigurationError', () => {
  it('should create error with message', () => {
    const error = new ConfigurationError('Invalid configuration')
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Invalid configuration')
    expect(error.name).toBe('ConfigurationError')
  })
})
