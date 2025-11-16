import { describe, it, expect } from 'vitest'
import { GitProviderError } from './GitProviderError.js'

describe('GitProviderError', () => {
  it('should create error with message', () => {
    const error = new GitProviderError('Git operation failed')
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Git operation failed')
    expect(error.name).toBe('GitProviderError')
    expect(error.status).toBeUndefined()
  })

  it('should create error with status code', () => {
    const error = new GitProviderError('Not found', 404)
    expect(error.message).toBe('Not found')
    expect(error.status).toBe(404)
  })
})
