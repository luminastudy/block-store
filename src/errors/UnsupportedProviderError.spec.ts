import { describe, it, expect } from 'vitest'
import { UnsupportedProviderError } from './UnsupportedProviderError.js'

describe('UnsupportedProviderError', () => {
  it('should create error with provider name', () => {
    const error = new UnsupportedProviderError('bitbucket')
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Unsupported provider: bitbucket')
    expect(error.name).toBe('UnsupportedProviderError')
  })
})
