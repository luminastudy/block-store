import { describe, it, expect } from 'vitest'
import { generateSourceKey, parseSourceKey } from './sourceKey.js'

describe('sourceKey utilities', () => {
  describe('generateSourceKey', () => {
    it('should generate key for GitHub provider', () => {
      const key = generateSourceKey('github', 'luminastudy', 'block-store')
      expect(key).toBe('github:luminastudy:block-store')
    })

    it('should generate key for GitLab provider', () => {
      const key = generateSourceKey('gitlab', 'my-org', 'my-repo')
      expect(key).toBe('gitlab:my-org:my-repo')
    })

    it('should handle organization and repository with special characters', () => {
      const key = generateSourceKey('github', 'org-name', 'repo_name')
      expect(key).toBe('github:org-name:repo_name')
    })
  })

  describe('parseSourceKey', () => {
    it('should parse GitHub source key correctly', () => {
      const result = parseSourceKey('github:luminastudy:block-store')
      expect(result).toEqual({
        provider: 'github',
        organization: 'luminastudy',
        repository: 'block-store',
      })
    })

    it('should parse GitLab source key correctly', () => {
      const result = parseSourceKey('gitlab:my-org:my-repo')
      expect(result).toEqual({
        provider: 'gitlab',
        organization: 'my-org',
        repository: 'my-repo',
      })
    })

    it('should throw error for invalid key format', () => {
      expect(() => parseSourceKey('invalid-key')).toThrow(
        'Invalid source key format'
      )
      expect(() => parseSourceKey('github:org')).toThrow(
        'Invalid source key format'
      )
      expect(() => parseSourceKey('github:org:repo:extra')).toThrow(
        'Invalid source key format'
      )
    })

    it('should throw error for invalid provider', () => {
      expect(() => parseSourceKey('bitbucket:org:repo')).toThrow(
        'Invalid provider in source key'
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

      const key = generateSourceKey(
        original.provider,
        original.organization,
        original.repository
      )
      const parsed = parseSourceKey(key)

      expect(parsed).toEqual(original)
    })
  })
})
