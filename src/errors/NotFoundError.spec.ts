import { describe, it, expect } from 'vitest'
import { NotFoundError } from './NotFoundError.js'

describe('NotFoundError', () => {
  it('should create error with message', () => {
    const error = new NotFoundError('Resource not found')
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Resource not found')
    expect(error.name).toBe('NotFoundError')
  })
})
