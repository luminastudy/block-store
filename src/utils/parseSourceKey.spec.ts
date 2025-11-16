import { describe, it, expect } from 'vitest'
import { parseSourceKey } from './parseSourceKey.js'

describe('parseSourceKey', () => {
  it('should parse GitHub source key correctly', () => {
    const result = parseSourceKey('github:luminastudy:block-store')
    expect(result).toEqual({
      provider: 'github',
      organization: 'luminastudy',
      repository: 'block-store',
    })
  })
})
