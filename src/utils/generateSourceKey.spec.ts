import { describe, it, expect } from 'vitest'
import { generateSourceKey } from './generateSourceKey.js'

describe('generateSourceKey', () => {
  it('should generate key for GitHub provider', () => {
    const key = generateSourceKey('github', 'luminastudy', 'block-store')
    expect(key).toBe('github:luminastudy:block-store')
  })
})
