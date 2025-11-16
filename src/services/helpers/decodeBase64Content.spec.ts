import { describe, it, expect } from 'vitest'
import { decodeBase64Content } from './decodeBase64Content.js'

describe('decodeBase64Content', () => {
  it('should decode base64 content', () => {
    const base64 = Buffer.from('Hello World', 'utf-8').toString('base64')
    const result = decodeBase64Content(base64)
    expect(result).toBe('Hello World')
  })
})
