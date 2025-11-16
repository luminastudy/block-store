import { describe, it, expect } from 'vitest'
import { generateBlockKey, parseBlockKey } from './blockKey.js'

describe('blockKey utilities', () => {
  describe('generateBlockKey', () => {
    it('should generate key for GitHub provider', () => {
      const key = generateBlockKey('github', 'luminastudy', 'block-store')
      expect(key).toBe('github:luminastudy:block-store')
    })

    it('should generate key for GitLab provider', () => {
      const key = generateBlockKey('gitlab', 'my-org', 'my-repo')
      expect(key).toBe('gitlab:my-org:my-repo')
    })

    it('should handle organization and repository with special characters', () => {
      const key = generateBlockKey('github', 'org-name', 'repo_name')
      expect(key).toBe('github:org-name:repo_name')
    })
  })

  describe('parseBlockKey', () => {
    it('should parse GitHub block key correctly', () => {
      const result = parseBlockKey('github:luminastudy:block-store')
      expect(result).toEqual({
        provider: 'github',
        organization: 'luminastudy',
        repository: 'block-store',
      })
    })

    it('should parse GitLab block key correctly', () => {
      const result = parseBlockKey('gitlab:my-org:my-repo')
      expect(result).toEqual({
        provider: 'gitlab',
        organization: 'my-org',
        repository: 'my-repo',
      })
    })

    it('should throw error for invalid key format', () => {
      expect(() => parseBlockKey('invalid-key')).toThrow(
        'Invalid block key format'
      )
      expect(() => parseBlockKey('github:org')).toThrow(
        'Invalid block key format'
      )
      expect(() => parseBlockKey('github:org:repo:extra')).toThrow(
        'Invalid block key format'
      )
    })

    it('should throw error for invalid provider', () => {
      expect(() => parseBlockKey('bitbucket:org:repo')).toThrow(
        'Invalid provider in block key'
      )
    })
  })

  describe('round trip', () => {
    it('should generate and parse key correctly', () => {
      const original = {
        provider: 'github' as const,
        organization: 'test-org',
        repository: 'test-repo',
      }

      const key = generateBlockKey(
        original.provider,
        original.organization,
        original.repository
      )
      const parsed = parseBlockKey(key)

      expect(parsed).toEqual(original)
    })
  })
})
